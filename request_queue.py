"""Priority request queues for complaint processing.

The API classifies and enqueues a complaint quickly. A single background
worker drains the queues in Critical -> High -> Medium -> Low order, carrying
unused capacity down to the next queue before invoking the existing resolver,
RAG, and LLM pipeline.

This is an in-process queue for local development and a single AWS task. For
multi-instance AWS deployment, replace this backend with SQS/DynamoDB while
keeping the same scheduler contract.
"""

import os
import sys
import threading
from collections import deque
from pathlib import Path
from typing import Callable, Dict, Any


PROJECT_ROOT = Path(__file__).parent
PRIORITY_PACKAGE = PROJECT_ROOT / "priority" / "priority"
if str(PRIORITY_PACKAGE) not in sys.path:
    sys.path.insert(0, str(PRIORITY_PACKAGE))


QUEUE_ORDER = ("critical", "high", "medium", "low")
PRIORITY_TO_QUEUE = {"P1": "critical", "P2": "high", "P3": "medium", "P4": "low"}
URGENCY_TO_QUEUE = {"CRITICAL": "critical", "HIGH": "high", "NEUTRAL": "medium", "MEDIUM": "medium", "LOW": "low"}
QUEUE_ALLOCATION = {"critical": 0.40, "high": 0.30, "medium": 0.20, "low": 0.10}


def classify_request(complaint: str) -> Dict[str, Any]:
    """Run the supplied sentiment/urgency priority model for one complaint."""
    from priority_engine import process_complaint

    result = process_complaint(complaint, status="Open")
    urgency = str(result.get("urgency", "NEUTRAL")).upper()
    priority = str(result.get("priority", "P3")).upper()
    queue_name = URGENCY_TO_QUEUE.get(urgency) or PRIORITY_TO_QUEUE.get(priority, "medium")
    return {**result, "urgency": urgency, "queue": queue_name}


def _allocate_capacity(total_capacity: int) -> Dict[str, int]:
    """Allocate whole request slots using largest-remainder rounding."""
    if total_capacity < 1:
        raise ValueError("QUEUE_MAX_CAPACITY must be at least 1")
    raw = {name: total_capacity * share for name, share in QUEUE_ALLOCATION.items()}
    allocation = {name: int(value) for name, value in raw.items()}
    remaining = total_capacity - sum(allocation.values())
    for name in sorted(QUEUE_ORDER, key=lambda key: raw[key] - allocation[key], reverse=True):
        if remaining <= 0:
            break
        allocation[name] += 1
        remaining -= 1
    return allocation


class ComplaintRequestQueue:
    """Thread-safe four-queue scheduler with downward capacity transfer."""

    def __init__(self, processor: Callable[[dict], None]):
        self.processor = processor
        self.max_capacity = int(os.getenv("QUEUE_MAX_CAPACITY", "12"))
        self.cycle_seconds = float(os.getenv("QUEUE_CYCLE_SECONDS", "1"))
        self._queues = {name: deque() for name in QUEUE_ORDER}
        self._lock = threading.RLock()
        self._wake = threading.Event()
        self._stopped = False
        self._worker = threading.Thread(target=self._run, name="complaint-queue-worker", daemon=True)
        self._worker.start()

    @property
    def allocation(self) -> Dict[str, int]:
        return _allocate_capacity(self.max_capacity)

    def submit(self, job: dict) -> Dict[str, Any]:
        queue_name = job["queue"]
        if queue_name not in self._queues:
            raise ValueError(f"Unknown complaint queue: {queue_name}")
        with self._lock:
            self._queues[queue_name].append(job)
            position = len(self._queues[queue_name])
        self._wake.set()
        return {"queue": queue_name, "position": position}

    def snapshot(self) -> Dict[str, Any]:
        with self._lock:
            return {"capacity": self.max_capacity, "allocation": self.allocation, "queues": {name: len(queue) for name, queue in self._queues.items()}}

    def stop(self) -> None:
        self._stopped = True
        self._wake.set()
        self._worker.join(timeout=2)

    def _take_batch(self) -> list[dict]:
        capacities = self.allocation
        selected = []
        with self._lock:
            for index, queue_name in enumerate(QUEUE_ORDER):
                available = capacities[queue_name]
                take_count = min(available, len(self._queues[queue_name]))
                for _ in range(take_count):
                    job = self._queues[queue_name].popleft()
                    job["status"] = "PROCESSING"
                    selected.append(job)
                unused = available - take_count
                if index + 1 < len(QUEUE_ORDER):
                    capacities[QUEUE_ORDER[index + 1]] += unused
        return selected

    def _run(self) -> None:
        while not self._stopped:
            self._wake.wait(timeout=self.cycle_seconds)
            self._wake.clear()
            batch = self._take_batch()
            if not batch:
                continue
            # Process in selection order so no lower-priority complaint is
            # sent to the LLM before earlier higher-priority work.
            for job in batch:
                self.processor(job)
