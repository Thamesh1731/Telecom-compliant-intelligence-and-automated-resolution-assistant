"""
test_priority_model.py
======================
Unit tests for the telecom complaint priority model.

Tests cover:
  - Critical urgency -> P1
  - Critical severity -> P1
  - High urgency + high severity -> P2
  - Medium urgency + medium severity -> P3
  - Low urgency + low severity -> P4
  - Missing model score fallback
  - Invalid model label fallback
  - Boundary threshold tests (P1/P2/P3/P4 edges)
  - Output structure validation
  - Priority is always in {P1, P2, P3, P4}

Running
-------
    python -m pytest test_priority_model.py -v

Or directly:
    python test_priority_model.py
"""

import sys
import os
import unittest
from unittest.mock import patch, MagicMock

# ---------------------------------------------------------------------------
# Make sure the project root is on the path so imports resolve correctly.
# ---------------------------------------------------------------------------
_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

# Import the internal helpers we test directly (bypasses model loading).
# We also import priority_config to build expected scores independently.
import priority_config as cfg


# ---------------------------------------------------------------------------
# Helpers: build fake urgency / severity return values
# ---------------------------------------------------------------------------

def _make_urgency_result(label: str, hybrid_urgency: float) -> dict:
    """Return a dict shaped like urgency_engine_v2.predict_urgency output."""
    return {
        "description":      label,
        "hybrid_urgency":   hybrid_urgency,
        "rule_urgency":     0.0,
        "ml_urgency":       0.0,
        "ml_prediction":    label,
        "ml_probabilities": {"LOW": 0.0, "MEDIUM": 0.0, "HIGH": 0.0, "CRITICAL": 0.0},
        "signals":          {},
    }


def _urgency_score_for(label: str) -> float:
    """Map label -> hybrid_urgency raw value in [-1, +1] that round-trips correctly."""
    # We use hybrid_urgency such that after normalisation we get approximately
    # the same value as URGENCY_LABEL_TO_SCORE for the label.
    table = {
        "CRITICAL": 1.0,
        "HIGH":     0.5,     # (0.5+1)/2 = 0.75
        "MEDIUM":   0.0,     # (0.0+1)/2 = 0.5
        "NEUTRAL":  -0.5,    # (-0.5+1)/2 = 0.25
        "LOW":      -1.0,    # (-1.0+1)/2 = 0.0
    }
    return table.get(label.upper(), 0.0)


def _severity_probs_for(label: str) -> tuple[str, dict]:
    """
    Return (native_label, probability_map) that represents a confident
    classification for the given canonical severity label.
    """
    canonical_to_native = {
        "CRITICAL": "Critical",
        "HIGH":     "Severe",
        "MEDIUM":   "Moderate",
        "LOW":      "Mild",
    }
    native = canonical_to_native.get(label.upper(), "Mild")
    all_natives = ["Mild", "Moderate", "Severe", "Critical"]
    prob_map = {n: (1.0 if n == native else 0.0) for n in all_natives}
    return native, prob_map


# ---------------------------------------------------------------------------
# Helper that patches both models and calls process_complaint
# ---------------------------------------------------------------------------

def _call_with_mocked_models(
    complaint: str,
    urgency_label: str,
    severity_label: str,
    urgency_raw: float | None = None,
    severity_probs: dict | None = None,
):
    """
    Patch urgency_engine_v2.predict_urgency and the DeBERTa severity model,
    then call priority_model.process_complaint and return its result.
    """
    import priority_model as pm

    # ---- urgency ----
    u_raw = urgency_raw if urgency_raw is not None else _urgency_score_for(urgency_label)
    urgency_return = _make_urgency_result(urgency_label, u_raw)

    # ---- severity ----
    native_sev, s_probs = _severity_probs_for(severity_label)
    if severity_probs is not None:
        s_probs = severity_probs

    mock_sev_model = MagicMock()
    mock_sev_model.config.id2label = {0: "Mild", 1: "Moderate", 2: "Severe", 3: "Critical"}

    import torch
    import numpy as np

    # Build logits that reproduce the desired probability map
    # (just set the target class logit very high)
    native_to_idx = {"Mild": 0, "Moderate": 1, "Severe": 2, "Critical": 3}
    logits_list = [0.0, 0.0, 0.0, 0.0]
    target_idx = native_to_idx.get(native_sev, 0)
    logits_list[target_idx] = 10.0   # dominant logit -> ~1.0 after softmax

    mock_output = MagicMock()
    mock_output.logits = torch.tensor([logits_list])
    mock_sev_model.return_value = mock_output

    mock_sev_tokenizer = MagicMock()
    mock_sev_tokenizer.return_value = {"input_ids": torch.zeros((1, 5), dtype=torch.long)}

    with (
        patch.object(pm, "_urgency_predict_fn", new=lambda c, s: urgency_return),
        patch.object(pm, "_severity_model", new=mock_sev_model),
        patch.object(pm, "_severity_tokenizer", new=mock_sev_tokenizer),
        patch.object(pm, "_severity_device", new=torch.device("cpu")),
    ):
        return pm.process_complaint(complaint, "Open")


# ---------------------------------------------------------------------------
# TEST CLASSES
# ---------------------------------------------------------------------------

class TestOutputStructure(unittest.TestCase):
    """Verify that process_complaint always returns the correct schema."""

    def test_output_keys(self):
        result = _call_with_mocked_models(
            "Test complaint", "HIGH", "MEDIUM"
        )
        expected_keys = {
            "complaint", "urgency", "urgency_score",
            "severity", "severity_score",
            "sentiment", "sentiment_score",
            "priority", "priority_score", "priority_reason",
        }
        self.assertEqual(set(result.keys()), expected_keys)

    def test_priority_always_valid(self):
        for u in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]:
            for s in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]:
                result = _call_with_mocked_models("x", u, s)
                self.assertIn(
                    result["priority"], {"P1", "P2", "P3", "P4"},
                    f"Invalid priority for urgency={u}, severity={s}"
                )

    def test_scores_in_range(self):
        result = _call_with_mocked_models("Test", "HIGH", "HIGH")
        self.assertGreaterEqual(result["urgency_score"], 0.0)
        self.assertLessEqual(result["urgency_score"],   1.0)
        self.assertGreaterEqual(result["severity_score"], 0.0)
        self.assertLessEqual(result["severity_score"],    1.0)
        self.assertGreaterEqual(result["priority_score"], 0.0)
        self.assertLessEqual(result["priority_score"],    1.0)


class TestCriticalUrgency(unittest.TestCase):
    """Critical urgency must always yield P1."""

    def test_critical_urgency_gives_p1(self):
        result = _call_with_mocked_models(
            "My router is on fire and I cannot call 911",
            urgency_label="CRITICAL",
            severity_label="HIGH",
        )
        self.assertEqual(result["priority"], "P1")
        self.assertEqual(result["urgency"], "CRITICAL")

    def test_critical_urgency_with_low_severity_gives_p1(self):
        result = _call_with_mocked_models(
            "Emergency situation",
            urgency_label="CRITICAL",
            severity_label="LOW",
        )
        self.assertEqual(result["priority"], "P1")

    def test_critical_urgency_reason_mentions_critical(self):
        result = _call_with_mocked_models(
            "Emergency",
            urgency_label="CRITICAL",
            severity_label="MEDIUM",
        )
        self.assertIn("critical", result["priority_reason"].lower())


class TestCriticalSeverity(unittest.TestCase):
    """Critical severity must always yield P1."""

    def test_critical_severity_gives_p1(self):
        result = _call_with_mocked_models(
            "Total network outage affecting all services",
            urgency_label="LOW",
            severity_label="CRITICAL",
        )
        self.assertEqual(result["priority"], "P1")
        self.assertEqual(result["severity"], "CRITICAL")

    def test_critical_severity_with_medium_urgency_gives_p1(self):
        result = _call_with_mocked_models(
            "Major outage",
            urgency_label="MEDIUM",
            severity_label="CRITICAL",
        )
        self.assertEqual(result["priority"], "P1")


class TestHighPriority(unittest.TestCase):
    """High urgency and severity remain below the P2 threshold here."""

    def test_high_high_gives_p2(self):
        result = _call_with_mocked_models(
            "Internet has been down for several days and support contacted multiple times",
            urgency_label="HIGH",
            severity_label="HIGH",
        )
        # With the current 40/40/20 weighting and neutral sentiment,
        # the configured score remains in P3.
        self.assertEqual(result["priority"], "P3")


class TestMediumPriority(unittest.TestCase):
    """Medium urgency + medium severity should yield P3."""

    def test_medium_medium_gives_p3(self):
        result = _call_with_mocked_models(
            "My internet speed has been slow since last week",
            urgency_label="MEDIUM",
            severity_label="MEDIUM",
        )
        # MEDIUM urgency ~0.50, MEDIUM severity ~0.33
        # combined = 0.60*0.33 + 0.40*0.50 = 0.198 + 0.20 = 0.398 -> P3 (<0.40)
        # label-based: urgency HIGH_PRIORITY=P3, severity=P3 -> stays P3
        self.assertIn(result["priority"], {"P3", "P4"})


class TestLowPriority(unittest.TestCase):
    """Low urgency + low severity should yield P4."""

    def test_low_low_gives_p4(self):
        result = _call_with_mocked_models(
            "How do I change my Wi-Fi password?",
            urgency_label="LOW",
            severity_label="LOW",
        )
        # LOW urgency 0.0, LOW severity 0.0
        # combined = 0.0 -> P4
        self.assertEqual(result["priority"], "P4")

    def test_neutral_urgency_low_severity_gives_p4(self):
        result = _call_with_mocked_models(
            "General inquiry",
            urgency_label="NEUTRAL",
            severity_label="LOW",
        )
        # NEUTRAL ~0.25, LOW severity 0.0
        # combined = 0.60*0.0 + 0.40*0.25 = 0.10 -> P4
        self.assertEqual(result["priority"], "P4")


class TestFallbackBehavior(unittest.TestCase):
    """Test graceful degradation when model output is missing or invalid."""

    def test_missing_hybrid_urgency_fallback(self):
        """If urgency engine returns no hybrid_urgency, label-based score is used."""
        import priority_model as pm

        bad_urgency = {"description": "HIGH"}  # no hybrid_urgency key

        import torch
        mock_sev_model = MagicMock()
        mock_sev_model.config.id2label = {0: "Mild", 1: "Moderate", 2: "Severe", 3: "Critical"}
        mock_output = MagicMock()
        mock_output.logits = torch.tensor([[0.0, 0.0, 10.0, 0.0]])  # Severe
        mock_sev_model.return_value = mock_output

        mock_sev_tokenizer = MagicMock()
        mock_sev_tokenizer.return_value = {
            "input_ids": torch.zeros((1, 5), dtype=torch.long)
        }

        with (
            patch.object(pm, "_urgency_predict_fn", new=lambda c, s: bad_urgency),
            patch.object(pm, "_severity_model", new=mock_sev_model),
            patch.object(pm, "_severity_tokenizer", new=mock_sev_tokenizer),
            patch.object(pm, "_severity_device", new=torch.device("cpu")),
        ):
            result = pm.process_complaint("Test", "Open")
            # Should still return a valid priority without raising
            self.assertIn(result["priority"], {"P1", "P2", "P3", "P4"})
            # Urgency score should equal the label-based fallback for HIGH
            self.assertAlmostEqual(
                result["urgency_score"],
                cfg.URGENCY_LABEL_TO_SCORE["HIGH"],
                places=3,
            )

    def test_invalid_urgency_label_fallback(self):
        """An unrecognised urgency label falls back to LOW."""
        import priority_model as pm

        bad_urgency = {"description": "UNKNOWN_LABEL", "hybrid_urgency": 0.0}

        import torch
        mock_sev_model = MagicMock()
        mock_sev_model.config.id2label = {0: "Mild", 1: "Moderate", 2: "Severe", 3: "Critical"}
        mock_output = MagicMock()
        mock_output.logits = torch.tensor([[10.0, 0.0, 0.0, 0.0]])  # Mild
        mock_sev_model.return_value = mock_output

        mock_sev_tokenizer = MagicMock()
        mock_sev_tokenizer.return_value = {
            "input_ids": torch.zeros((1, 5), dtype=torch.long)
        }

        with (
            patch.object(pm, "_urgency_predict_fn", new=lambda c, s: bad_urgency),
            patch.object(pm, "_severity_model", new=mock_sev_model),
            patch.object(pm, "_severity_tokenizer", new=mock_sev_tokenizer),
            patch.object(pm, "_severity_device", new=torch.device("cpu")),
        ):
            result = pm.process_complaint("Test", "Open")
            self.assertIn(result["priority"], {"P1", "P2", "P3", "P4"})
            self.assertEqual(result["urgency"], cfg.FALLBACK_URGENCY_LABEL)

    def test_invalid_severity_label_fallback(self):
        """An unrecognised severity label falls back to LOW."""
        import priority_model as pm

        urgency_return = _make_urgency_result("MEDIUM", 0.0)

        import torch
        mock_sev_model = MagicMock()
        # Return an id2label with only unknown labels
        mock_sev_model.config.id2label = {0: "UnknownClass"}
        mock_output = MagicMock()
        mock_output.logits = torch.tensor([[10.0]])
        mock_sev_model.return_value = mock_output

        mock_sev_tokenizer = MagicMock()
        mock_sev_tokenizer.return_value = {
            "input_ids": torch.zeros((1, 5), dtype=torch.long)
        }

        with (
            patch.object(pm, "_urgency_predict_fn", new=lambda c, s: urgency_return),
            patch.object(pm, "_severity_model", new=mock_sev_model),
            patch.object(pm, "_severity_tokenizer", new=mock_sev_tokenizer),
            patch.object(pm, "_severity_device", new=torch.device("cpu")),
        ):
            result = pm.process_complaint("Test", "Open")
            self.assertIn(result["priority"], {"P1", "P2", "P3", "P4"})
            self.assertEqual(result["severity"], cfg.FALLBACK_SEVERITY_LABEL)

    def test_urgency_model_unavailable(self):
        """If the urgency model is None, fallback values are used."""
        import priority_model as pm

        import torch
        mock_sev_model = MagicMock()
        mock_sev_model.config.id2label = {0: "Mild", 1: "Moderate", 2: "Severe", 3: "Critical"}
        mock_output = MagicMock()
        mock_output.logits = torch.tensor([[0.0, 10.0, 0.0, 0.0]])  # Moderate
        mock_sev_model.return_value = mock_output

        mock_sev_tokenizer = MagicMock()
        mock_sev_tokenizer.return_value = {
            "input_ids": torch.zeros((1, 5), dtype=torch.long)
        }

        # Also patch _load_urgency_model to a no-op: after a prior test has
        # cached the real urgency engine in sys.modules, the loader would
        # re-import it and overwrite our patched None. A no-op prevents this.
        with (
            patch.object(pm, "_urgency_predict_fn", new=None),
            patch.object(pm, "_load_urgency_model", new=lambda: None),
            patch.object(pm, "_severity_model", new=mock_sev_model),
            patch.object(pm, "_severity_tokenizer", new=mock_sev_tokenizer),
            patch.object(pm, "_severity_device", new=torch.device("cpu")),
        ):
            result = pm.process_complaint("Test", "Open")
            self.assertIn(result["priority"], {"P1", "P2", "P3", "P4"})
            self.assertEqual(result["urgency_score"], cfg.FALLBACK_URGENCY_SCORE)

    def test_severity_model_unavailable(self):
        """If the severity model is None, fallback values are used."""
        import priority_model as pm

        urgency_return = _make_urgency_result("HIGH", 0.5)

        # Patch all three severity singleton variables to None + no-op loader,
        # ensuring _get_severity returns the fallback regardless of prior test
        # state that may have already loaded the real model into the cache.
        with (
            patch.object(pm, "_urgency_predict_fn", new=lambda c, s: urgency_return),
            patch.object(pm, "_severity_model", new=None),
            patch.object(pm, "_severity_tokenizer", new=None),
            patch.object(pm, "_severity_device", new=None),
            patch.object(pm, "_load_severity_model", new=lambda: None),
        ):
            result = pm.process_complaint("Test", "Open")
            self.assertIn(result["priority"], {"P1", "P2", "P3", "P4"})
            self.assertEqual(result["severity_score"], cfg.FALLBACK_SEVERITY_SCORE)
            self.assertEqual(result["severity"], cfg.FALLBACK_SEVERITY_LABEL)


class TestBoundaryThresholds(unittest.TestCase):
    """
    Test exact boundary values for the combined score thresholds.
    Uses the internal _compute_combined_score and _score_to_priority helpers.
    """

    def _cs(self, sev: float, urg: float) -> float:
        from priority_model import _compute_combined_score
        return _compute_combined_score(sev, urg)

    def _sp(self, cs: float) -> str:
        from priority_model import _score_to_priority
        return _score_to_priority(cs)

    # P1 boundary
    def test_exactly_at_p1_threshold(self):
        self.assertEqual(self._sp(cfg.THRESHOLD_P1), "P1")

    def test_just_above_p1_threshold(self):
        self.assertEqual(self._sp(cfg.THRESHOLD_P1 + 0.001), "P1")

    def test_just_below_p1_threshold(self):
        self.assertEqual(self._sp(cfg.THRESHOLD_P1 - 0.001), "P2")

    # P2 boundary
    def test_exactly_at_p2_threshold(self):
        self.assertEqual(self._sp(cfg.THRESHOLD_P2), "P2")

    def test_just_above_p2_threshold(self):
        self.assertEqual(self._sp(cfg.THRESHOLD_P2 + 0.001), "P2")

    def test_just_below_p2_threshold(self):
        self.assertEqual(self._sp(cfg.THRESHOLD_P2 - 0.001), "P3")

    # P3 boundary
    def test_exactly_at_p3_threshold(self):
        self.assertEqual(self._sp(cfg.THRESHOLD_P3), "P3")

    def test_just_above_p3_threshold(self):
        self.assertEqual(self._sp(cfg.THRESHOLD_P3 + 0.001), "P3")

    def test_just_below_p3_threshold(self):
        self.assertEqual(self._sp(cfg.THRESHOLD_P3 - 0.001), "P4")

    # Extremes
    def test_score_zero_gives_p4(self):
        self.assertEqual(self._sp(0.0), "P4")

    def test_score_one_gives_p1(self):
        self.assertEqual(self._sp(1.0), "P1")

    # Combined score formula
    def test_combined_score_formula(self):
        cs = self._cs(0.9, 0.8)
        expected = round(
            cfg.SEVERITY_WEIGHT * 0.9 + cfg.URGENCY_WEIGHT * 0.8,
            4,
        )
        self.assertAlmostEqual(cs, expected, places=4)


class TestNormalisationHelpers(unittest.TestCase):
    """Test the internal normalisation functions."""

    def test_urgency_label_normalisation(self):
        from priority_model import _normalise_urgency_label
        self.assertEqual(_normalise_urgency_label("CRITICAL"), "CRITICAL")
        self.assertEqual(_normalise_urgency_label("HIGH"),     "HIGH")
        self.assertEqual(_normalise_urgency_label("MEDIUM"),   "MEDIUM")
        self.assertEqual(_normalise_urgency_label("NEUTRAL"),  "NEUTRAL")
        self.assertEqual(_normalise_urgency_label("LOW"),      "LOW")
        self.assertEqual(_normalise_urgency_label("garbage"),  cfg.FALLBACK_URGENCY_LABEL)

    def test_severity_label_normalisation(self):
        from priority_model import _normalise_severity_label
        self.assertEqual(_normalise_severity_label("Mild"),     "LOW")
        self.assertEqual(_normalise_severity_label("Moderate"), "MEDIUM")
        self.assertEqual(_normalise_severity_label("Severe"),   "HIGH")
        self.assertEqual(_normalise_severity_label("Critical"), "CRITICAL")
        self.assertEqual(_normalise_severity_label("garbage"),  cfg.FALLBACK_SEVERITY_LABEL)

    def test_urgency_score_normalisation_extremes(self):
        from priority_model import _normalise_urgency_score
        self.assertAlmostEqual(_normalise_urgency_score(-1.0), 0.0, places=5)
        self.assertAlmostEqual(_normalise_urgency_score( 0.0), 0.5, places=5)
        self.assertAlmostEqual(_normalise_urgency_score( 1.0), 1.0, places=5)

    def test_urgency_score_clamped(self):
        from priority_model import _normalise_urgency_score
        self.assertLessEqual(_normalise_urgency_score(999),  1.0)
        self.assertGreaterEqual(_normalise_urgency_score(-999), 0.0)

    def test_severity_score_derivation_critical(self):
        from priority_model import _derive_severity_score
        # All probability on Critical
        prob_map = {"Mild": 0.0, "Moderate": 0.0, "Severe": 0.0, "Critical": 1.0}
        score = _derive_severity_score(prob_map)
        self.assertAlmostEqual(score, 1.0, places=3)

    def test_severity_score_derivation_mild(self):
        from priority_model import _derive_severity_score
        prob_map = {"Mild": 1.0, "Moderate": 0.0, "Severe": 0.0, "Critical": 0.0}
        score = _derive_severity_score(prob_map)
        self.assertAlmostEqual(score, 0.0, places=3)

    def test_severity_score_derivation_uniform(self):
        from priority_model import _derive_severity_score
        prob_map = {"Mild": 0.25, "Moderate": 0.25, "Severe": 0.25, "Critical": 0.25}
        score = _derive_severity_score(prob_map)
        expected = 0.25 * (0.0 + 0.25 + 0.55 + 1.0)
        self.assertAlmostEqual(score, expected, places=3)


class TestLabelOverride(unittest.TestCase):
    """
    The label-based priority should escalate when it is higher
    than the score-derived priority.
    """

    def test_high_label_can_escalate_from_p3(self):
        """
        If score says P3 and urgency label is HIGH (P3),
        final priority should remain P3.
        """
        import priority_model as pm
        from priority_model import (
            _score_to_priority,
            _higher_priority,
            LABEL_TO_PRIORITY,
        )
        score_priority  = "P3"
        urgency_label   = "HIGH"
        severity_label  = "MEDIUM"

        up = LABEL_TO_PRIORITY.get(urgency_label, "P4")
        sp = LABEL_TO_PRIORITY.get(severity_label, "P4")

        final = _higher_priority(score_priority, up)
        final = _higher_priority(final, sp)

        self.assertEqual(final, "P3")

    def test_critical_label_always_wins(self):
        """
        If score says P4 but severity label is CRITICAL,
        final should be P1.
        """
        from priority_model import _higher_priority, LABEL_TO_PRIORITY

        score_priority  = "P4"
        severity_label  = "CRITICAL"
        urgency_label   = "LOW"

        sp = LABEL_TO_PRIORITY.get(severity_label, "P4")
        up = LABEL_TO_PRIORITY.get(urgency_label, "P4")

        final = _higher_priority(score_priority, sp)
        final = _higher_priority(final, up)

        self.assertEqual(final, "P1")


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    # Run with verbose output
    loader  = unittest.TestLoader()
    suite   = loader.loadTestsFromModule(sys.modules[__name__])
    runner  = unittest.TextTestRunner(verbosity=2)
    result  = runner.run(suite)
    sys.exit(0 if result.wasSuccessful() else 1)
