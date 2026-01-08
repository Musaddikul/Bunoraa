from django.db import connection
cur = connection.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name='pages_sitesettings' ORDER BY ordinal_position;")
rows = cur.fetchall()
print([r[0] for r in rows])
