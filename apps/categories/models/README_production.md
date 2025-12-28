Production-ready Category Classifier — Overview and instructions

Purpose
-------
This document describes how to train, validate, export and deploy a production-ready product category classifier compatible with Bunoraa's app.
The production model should: expose a `predict(texts: List[str]) -> List[dict]` API returning predictions: list of {"category_code": "CAT_...", "confidence": 0.0..1.0} per text, be serializable to `apps/categories/models/classifier.pt` (Torch serialized object or TorchScript/ONNX artifact), and be robust for CPU inference.

High-level recipe
-----------------
1. Data
   - Collect labeled product samples (title + description) with ground-truth category_code (mapped to `Category.code`).
   - Partition into train/val/test; keep a holdout set for final evaluation.
   - Ensure label coverage, class balance strategy (oversample or re-weight), and a small dev set for quick iterations.

2. Model selection
   - For best accuracy and reasonable latency: fine-tune `distilbert-base-uncased` or `bert-base-uncased` for multi-class classification over category codes.
   - For lightweight low-latency CPU inference: consider `distilbert` or smaller TF-IDF + linear classifier (scikit-learn) if dataset is small.
   - For edge deployment use quantized TorchScript or ONNX export.

3. Training & evaluation
   - Use HuggingFace Transformers Trainer or a PyTorch training loop with metrics: accuracy, macro-F1, per-class recall/precision.
   - Track model runs with MLflow or WandB. Save artifacts and training hyperparameters.
   - Evaluate on holdout: report top-1 accuracy and top-3 coverage.

4. Packaging and export
   - Wrap the model in a thin class with a `predict()` method that accepts a list of strings and returns predictions list-of-dicts.
   - Export options:
     - torch.save(wrapper, "classifier.pt") (simple Python object)
     - script = torch.jit.script(wrapper) → torch.jit.save(script, "classifier_jit.pt") for TorchScript
     - Export to ONNX for broad serving options
   - Provide a small `classify()` wrapper that does tokenization and batching consistently with training.

5. Deployment
   - Serve model via a model server (TorchServe / FastAPI + Gunicorn) or embed into Django as a loaded artifact for low-throughput use.
   - For scale, deploy the model to a dedicated inference service (e.g., AWS SageMaker, GCP AI Platform) and call via HTTP.

6. Monitoring & governance
   - Log input text and predicted category_code/confidence; track predictions vs. eventual human-verified labels where available.
   - Flag low-confidence predictions (confidence < threshold, e.g., 0.5) for human review and retraining.
   - Schedule retraining monthly or when label drift exceeds threshold.

Model interface spec
--------------------
- Class: ProductionClassifier
- Methods:
  - predict(texts: List[str], top_k: int = 3) -> List[List[dict]]
    - returns one list per input text with predictions sorted by confidence. Each prediction is {"category_code": ..., "confidence": 0.xx}

Quality & Safety
----------------
- Test on unseen products and categories.
- Explicitly exclude PII & sensitive fields from training data.

Operations
----------
- Store artifacts in a model registry or S3 with semantic versioning (e.g., classifier:v1.0.0).
- Add a CI/GitHub Action to run a unit test suite that loads the saved artifact and runs simple predictions to validate shape and latency.

Install
-------
For development and training, install the optional ML dependencies:

```bash
pip install -r requirements-ml.txt
```

Next steps (I can do these for you):
- Add a training example script using HuggingFace and a small export wrapper (Python files included in repo).
- Add a CI job to validate model artifacts on PRs.
- Provide a FastAPI inference server template with a healthcheck and metrics (Prometheus) integration.
