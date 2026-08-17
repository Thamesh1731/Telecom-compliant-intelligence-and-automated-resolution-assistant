import os
import boto3
from pathlib import Path
from typing import Optional

# Default configuration from environment or fallbacks
DEFAULT_BUCKET = os.getenv("MODEL_S3_BUCKET", "telecom-assistant")
DEFAULT_PREFIX = os.getenv("MODEL_S3_PREFIX", "priority1/")


def get_s3_client():
    """Returns an authenticated boto3 S3 client."""
    return boto3.client(
        "s3",
        region_name=os.getenv("AWS_REGION", "us-east-1"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID") or None,
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY") or None,
    )


def ensure_model_file(
    s3_key: str,
    local_path: Optional[str] = None,
    bucket_name: str = DEFAULT_BUCKET,
) -> str:
    """
    Downloads a single model file from S3 if it doesn't already exist locally.
    
    :param s3_key: S3 object key (e.g. 'priority1/model.pt')
    :param local_path: Local destination path (defaults to s3_key relative to current dir)
    :param bucket_name: S3 bucket name
    :return: Absolute local path to the downloaded file
    """
    if local_path is None:
        local_path = s3_key

    local_file = Path(local_path).resolve()
    if local_file.exists():
        print(f"✅ [S3 Model] Model file already exists locally: {local_file}")
        return str(local_file)

    local_file.parent.mkdir(parents=True, exist_ok=True)
    print(f"⬇️ [S3 Model] Downloading s3://{bucket_name}/{s3_key} -> {local_file}...")

    s3 = get_s3_client()
    try:
        s3.download_file(bucket_name, s3_key, str(local_file))
        print(f"✅ [S3 Model] Download complete: {local_file}")
        return str(local_file)
    except Exception as e:
        print(f"❌ [S3 Model] Error downloading s3://{bucket_name}/{s3_key}: {e}")
        raise e


def ensure_model_directory(
    s3_prefix: str = DEFAULT_PREFIX,
    local_dir: Optional[str] = None,
    bucket_name: str = DEFAULT_BUCKET,
) -> str:
    """
    Downloads all files under an S3 prefix/folder (e.g. 'priority1/') to a local directory.
    
    :param s3_prefix: S3 folder prefix (e.g. 'priority1/')
    :param local_dir: Local directory to save files (defaults to s3_prefix name)
    :param bucket_name: S3 bucket name
    :return: Absolute local path to the folder
    """
    s3_prefix = s3_prefix.rstrip("/") + "/"
    if local_dir is None:
        local_dir = s3_prefix.rstrip("/")

    dest_dir = Path(local_dir).resolve()
    dest_dir.mkdir(parents=True, exist_ok=True)

    s3 = get_s3_client()
    paginator = s3.get_paginator("list_objects_v2")
    pages = paginator.paginate(Bucket=bucket_name, Prefix=s3_prefix)

    found_files = 0
    for page in pages:
        for obj in page.get("Contents", []):
            key = obj["Key"]
            if key.endswith("/"):
                continue  # skip directory marker

            rel_path = os.path.relpath(key, s3_prefix)
            target_path = dest_dir / rel_path
            target_path.parent.mkdir(parents=True, exist_ok=True)

            if not target_path.exists():
                print(f"⬇️ [S3 Model] Downloading {key} -> {target_path}...")
                s3.download_file(bucket_name, key, str(target_path))
                found_files += 1
            else:
                print(f"✅ [S3 Model] {rel_path} already exists locally.")

    print(f"✅ [S3 Model] Sync complete for {dest_dir} (Downloaded {found_files} new files)")
    return str(dest_dir)


if __name__ == "__main__":
    # Test execution
    print("Testing S3 model sync...")
    ensure_model_directory(s3_prefix=DEFAULT_PREFIX, local_dir="priority1", bucket_name=DEFAULT_BUCKET)
