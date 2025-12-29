"""
Template script to fine-tune a production-ready classifier using HuggingFace Transformers.
This is a template and expects a CSV/JSONL dataset with columns: "text" and "category_code".

Usage (example):
python train_production_classifier.py --data data/products_train.jsonl --model distilbert-base-uncased --out_dir ./outputs/classifier_v1

Notes:
- Requires `transformers`, `datasets`, `scikit-learn`, `torch`.
- Adapt preprocessing and dataset column names to your data source.
"""

from pathlib import Path
import argparse
import json
import torch
import numpy as np

# Optional ML dependencies - import lazily and provide friendly errors when missing.
try:
    from datasets import load_dataset, ClassLabel, Dataset
except Exception:
    load_dataset = ClassLabel = Dataset = None

try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
except Exception:
    AutoTokenizer = AutoModelForSequenceClassification = TrainingArguments = Trainer = None

try:
    from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
except Exception:
    accuracy_score = f1_score = precision_score = recall_score = None


def compute_metrics(pred):
    if f1_score is None or accuracy_score is None:
        raise RuntimeError("Missing 'scikit-learn' dependency. Install with: pip install scikit-learn or pip install -r requirements-ml.txt")
    labels = pred.label_ids
    preds = np.argmax(pred.predictions, axis=1)
    return {
        'accuracy': accuracy_score(labels, preds),
        'f1_macro': f1_score(labels, preds, average='macro')
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', required=True, help='path to jsonl or csv with text and category_code')
    parser.add_argument('--model', default='distilbert-base-uncased')
    parser.add_argument('--out_dir', default='./outputs/classifier')
    parser.add_argument('--epochs', type=int, default=3)
    parser.add_argument('--per_device_train_batch_size', type=int, default=16)
    args = parser.parse_args()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Ensure optional ML dependencies are available
    if load_dataset is None or AutoTokenizer is None:
        raise RuntimeError("Missing ML dependencies. Install with: pip install -r requirements-ml.txt (transformers, datasets, scikit-learn)")

    # Load dataset (assumes jsonl with {"text": ..., "category_code": ...})
    if args.data.endswith('.jsonl') or args.data.endswith('.json'):
        dataset = load_dataset('json', data_files={'train': args.data})['train']
    else:
        dataset = load_dataset('csv', data_files={'train': args.data})['train']

    # Map category codes to ClassLabel
    unique_labels = sorted(list({r['category_code'] for r in dataset}))
    label2id = {l: i for i, l in enumerate(unique_labels)}
    id2label = {i: l for l, i in label2id.items()}

    def map_labels(ex):
        ex['labels'] = label2id[ex['category_code']]
        return ex

    dataset = dataset.map(map_labels)

    tokenizer = AutoTokenizer.from_pretrained(args.model)

    def preprocess(examples):
        return tokenizer(examples['text'], truncation=True, padding='max_length', max_length=128)

    dataset = dataset.map(preprocess, batched=True)
    dataset = dataset.with_format('torch', columns=['input_ids', 'attention_mask', 'labels'])

    model = AutoModelForSequenceClassification.from_pretrained(args.model, num_labels=len(unique_labels))
    model.config.id2label = id2label
    model.config.label2id = label2id

    training_args = TrainingArguments(
        output_dir=str(out_dir),
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.per_device_train_batch_size,
        evaluation_strategy='no',
        save_strategy='epoch',
        fp16=torch.cuda.is_available(),
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
        compute_metrics=compute_metrics
    )

    trainer.train()
    trainer.save_model(str(out_dir / 'hf_model'))

    # Save label mappings
    with open(out_dir / 'label_map.json', 'w') as f:
        json.dump({'id2label': id2label, 'label2id': label2id}, f)

    print('Training finished. Export model using export_production_model.py')


if __name__ == '__main__':
    main()
