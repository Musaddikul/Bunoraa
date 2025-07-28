from django_hosts import patterns, host

host_patterns = patterns(
    '',
    host(r'www', 'core.urls', name='www'),
    host(r'products', 'products.urls', name='products'),
)