import pathlib


def test_product_admin_source_contains_product_classifier_js():
    p = pathlib.Path(__file__).resolve().parents[1] / 'admin.py'
    text = p.read_text(encoding='utf-8')
    assert 'js/admin/product_classifier.js' in text, 'admin.py should include product_classifier.js in Media JS'
