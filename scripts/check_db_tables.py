"""
Script to check database tables and fix index creation.
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection
from django.core.management import call_command

def get_all_tables():
    """Get all table names in the database."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename
        """)
        return [row[0] for row in cursor.fetchall()]

def get_table_columns(table_name):
    """Get all columns in a table."""
    with connection.cursor() as cursor:
        cursor.execute(f"""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = %s 
            ORDER BY ordinal_position
        """, [table_name])
        return [row[0] for row in cursor.fetchall()]

def check_and_fix_indexes():
    """Check tables and columns, fix index creation."""
    print("=" * 70)
    print("DATABASE TABLE AND INDEX VERIFICATION")
    print("=" * 70)
    
    tables = get_all_tables()
    print(f"\n✅ Found {len(tables)} tables in database:\n")
    
    for table in sorted(tables):
        print(f"  - {table}")
    
    # Check specific tables mentioned in errors
    print("\n" + "=" * 70)
    print("CHECKING PROBLEMATIC TABLES")
    print("=" * 70)
    
    problematic_tables = {
        'products_product': ['category_id', 'is_active', 'created_at', 'price'],
        'analytics_pageview': ['created_at', 'session_id'],
        'orders_order': ['user_id', 'status', 'created_at'],
        'accounts_userbehaviorprofile': ['user_id'],
        'accounts_userinteraction': ['user_id', 'created_at'],
    }
    
    for table_name, expected_cols in problematic_tables.items():
        print(f"\n📋 Table: {table_name}")
        if table_name in tables:
            print(f"   Status: ✅ EXISTS")
            cols = get_table_columns(table_name)
            print(f"   Columns ({len(cols)}): {', '.join(cols)}")
            for col in expected_cols:
                if col in cols:
                    print(f"     ✅ {col}")
                else:
                    print(f"     ❌ {col} (MISSING)")
        else:
            print(f"   Status: ❌ MISSING")
    
    print("\n" + "=" * 70)
    print("RUNNING FIXED SETUP COMMAND")
    print("=" * 70 + "\n")
    
    # Run the fixed setup
    call_command('setup_production', migrate=True, collectstatic=True, optimize_db=True)

if __name__ == '__main__':
    check_and_fix_indexes()
