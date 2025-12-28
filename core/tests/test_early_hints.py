from django.test import RequestFactory
from django.http import HttpResponse
from core.middleware.early_hints import EarlyHintsMiddleware


def test_early_hints_adds_link_header():
    rf = RequestFactory()
    req = rf.get('/')
    resp = HttpResponse('<html>ok</html>', content_type='text/html')
    mw = EarlyHintsMiddleware()
    resp2 = mw.process_response(req, resp)
    assert 'Link' in resp2
    link = resp2['Link']
    assert 'rel=preload' in link
    # ensure both CSS and JS preload entries are present (hashed names allowed)
    assert '.css' in link and '.js' in link