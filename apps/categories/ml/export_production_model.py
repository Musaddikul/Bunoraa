"""
Export a trained HuggingFace model into a production artifact expected by Bunoraa:
- Produces `classifier.pt` which contains a `ProductionClassifier` object with method `predict(texts: List[str], top_k: int)`.
- Optionally also writes a TorchScript artifact `classifier_jit.pt` for faster CPU inference.

Usage:
python export_production_model.py --hf_dir ./outputs/classifier_v1/hf_model --label_map ./outputs/classifier_v1/label_map.json --out_dir ./apps/categories/models

Note: this script expects `transformers` and `torch` installed.
"""

import argparse
from pathlib import Path
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from typing import List


class ProductionClassifier(torch.nn.Module):
    """Thin wrapper that exposes predict() for a list of strings.
    The internal model uses the same tokenizer and model used during training.
    """

    def __init__(self, hf_model, tokenizer, id2label, label2id, device='cpu'):
        super().__init__()
        self.device = device
        self.model = hf_model.to(device)
        self.model.eval()
        self.tokenizer = tokenizer
        self.id2label = id2label
        self.label2id = label2id

    def forward(self, input_ids, attention_mask):
        return self.model(input_ids=input_ids, attention_mask=attention_mask)

    def predict(self, texts: List[str], top_k: int = 3, batch_size: int = 32) -> List[List[dict]]:
        results = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            enc = self.tokenizer(batch, padding=True, truncation=True, max_length=128, return_tensors='pt')
            enc = {k: v.to(self.device) for k, v in enc.items()}
            with torch.no_grad():
                out = self.model(**enc)
                logits = out.logits.cpu()
                probs = torch.softmax(logits, dim=-1)
                topk = torch.topk(probs, k=min(top_k, probs.shape[1]), dim=-1)
                for row in range(probs.shape[0]):
                    items = []
                    for score, idx in zip(topk.values[row], topk.indices[row]):
                        items.append({'category_code': self.id2label[str(int(idx.item()))] if isinstance(self.id2label, dict) else self.id2label[int(idx.item())], 'confidence': float(score.item())})
                    results.append(items)
        return results


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--hf_dir', required=True)
    parser.add_argument('--label_map', required=True)
    parser.add_argument('--out_dir', required=True)
    parser.add_argument('--device', default='cpu')
    parser.add_argument('--jit', action='store_true', help='Also save TorchScript JIT artifact')
    args = parser.parse_args()

    hf_dir = Path(args.hf_dir)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    with open(args.label_map) as f:
        label_map = json.load(f)
    id2label = label_map['id2label']
    label2id = label_map['label2id']

    tokenizer = AutoTokenizer.from_pretrained(str(hf_dir))
    model = AutoModelForSequenceClassification.from_pretrained(str(hf_dir))

    # ensure id2label is strings of ids -> category_code
    # if HF set id2label as ints to names, keep it but unify to str-indexed map
    if isinstance(id2label, dict):
        # already good
        pass

    wrapper = ProductionClassifier(model, tokenizer, id2label, label2id, device=args.device)

    artifact_path = out_dir / 'classifier.pt'
    print(f'Saving production artifact to {artifact_path}')
    torch.save({'model': wrapper, 'meta': {'id2label': id2label, 'label2id': label2id}}, artifact_path)

    if args.jit:
        print('Tracing/ scripting model to TorchScript (this can increase runtime portability)...')
        example = "example product title"  # small example
        enc = tokenizer([example], padding=True, truncation=True, max_length=128, return_tensors='pt')
        scripted = torch.jit.trace(wrapper, (enc['input_ids'].to(args.device), enc['attention_mask'].to(args.device)))
        torch.jit.save(scripted, out_dir / 'classifier_jit.pt')

    print('Done.')


if __name__ == '__main__':
    main()
