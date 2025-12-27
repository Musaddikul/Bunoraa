from django.utils.deprecation import MiddlewareMixin
from django.conf import settings

class EarlyHintsMiddleware(MiddlewareMixin):
    """Attach Link headers for preload to speed up resource fetch.

    Sends Link headers for the main CSS and main JS files. Gives browsers a head-start.
    """
    def process_response(self, request, response):
        try:
            if 'text/html' in response.get('Content-Type', '') and request.method == 'GET':
                links = []
                # Preload main stylesheet
                main_css = getattr(settings, 'MAIN_CSS', '/static/css/styles.css')
                links.append(f'<{main_css}>; rel=preload; as=style')
                # Preconnect to CDN/Asset host if configured
                asset_host = getattr(settings, 'ASSET_HOST', None)
                if asset_host:
                    links.append(f'<{asset_host}>; rel=preconnect; crossorigin')
                # Preload main JS if exists
                main_js = getattr(settings, 'MAIN_JS', '/static/js/app.js')
                links.append(f'<{main_js}>; rel=preload; as=script')
                existing = response.get('Link')
                link_header = ', '.join(links)
                if existing:
                    response['Link'] = existing + ', ' + link_header
                else:
                    response['Link'] = link_header
        except Exception:
            pass
        return response