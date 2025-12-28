Classifier model placement

Place a PyTorch model file for product-category classification at:

  apps/categories/models/classifier.pt

The classifier module (`apps/categories/classifier.py`) will attempt to load this file at import time if `torch` is installed. The model should accept raw text input or expose a `predict` method that returns a list of predictions like:

  [ {"category_code": "CAT_XXXX", "confidence": 0.85}, ... ]

If the model is not present or fails to load, the system will gracefully fall back to a lightweight keyword heuristic.

For production, host the model artifact in a secure storage (S3, GCS) and deploy to the release assets; on deployment, copy it to the path above or set up your deployment to place it into the container filesystem.