"""
Management command to seed Bangladesh location data (divisions, districts, upazilas).
"""
import json
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.localization.models import Country, Division, District


class Command(BaseCommand):
    help = 'Seeds Bangladesh divisions, districts, and shipping zones'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing Bangladesh location data before seeding',
        )

    def handle(self, *args, **options):
        fixtures_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            'fixtures'
        )
        
        # Load fixture files
        divisions_file = os.path.join(fixtures_dir, 'bangladesh_divisions.json')
        districts_file = os.path.join(fixtures_dir, 'bangladesh_districts.json')
        
        if not os.path.exists(divisions_file):
            self.stderr.write(self.style.ERROR(f'Divisions file not found: {divisions_file}'))
            return
        
        if not os.path.exists(districts_file):
            self.stderr.write(self.style.ERROR(f'Districts file not found: {districts_file}'))
            return
        
        with open(divisions_file, 'r', encoding='utf-8') as f:
            divisions_data = json.load(f)
        
        with open(districts_file, 'r', encoding='utf-8') as f:
            districts_data = json.load(f)
        
        with transaction.atomic():
            # Get or create Bangladesh
            bangladesh, created = Country.objects.get_or_create(
                code='BD',
                defaults={
                    'name': 'Bangladesh',
                    'native_name': 'বাংলাদেশ',
                    'code_alpha3': 'BGD',
                    'phone_code': '+880',
                    'default_currency_code': 'BDT',
                    'continent': 'Asia',
                    'is_active': True,
                    'is_shipping_available': True,
                    'sort_order': 1,
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS('Created Bangladesh country record'))
            else:
                self.stdout.write('Bangladesh country already exists')
            
            if options['clear']:
                # Clear existing divisions and districts for Bangladesh
                Division.objects.filter(country=bangladesh).delete()
                self.stdout.write(self.style.WARNING('Cleared existing Bangladesh location data'))
            
            # Create divisions
            divisions_map = {}
            for div_data in divisions_data.get('divisions', []):
                division, created = Division.objects.update_or_create(
                    country=bangladesh,
                    code=div_data['code'],
                    defaults={
                        'name': div_data['name'],
                        'native_name': div_data.get('native_name', ''),
                        'latitude': div_data.get('latitude'),
                        'longitude': div_data.get('longitude'),
                        'is_active': True,
                        'is_shipping_available': True,
                        'sort_order': div_data.get('sort_order', 0),
                    }
                )
                divisions_map[div_data['code']] = division
                action = 'Created' if created else 'Updated'
                self.stdout.write(f'  {action} division: {division.name}')
            
            # Create districts
            for dist_data in districts_data.get('districts', []):
                division_code = dist_data.get('division')
                division = divisions_map.get(division_code)
                
                if not division:
                    self.stderr.write(
                        self.style.WARNING(f'Division {division_code} not found for district {dist_data["name"]}')
                    )
                    continue
                
                district, created = District.objects.update_or_create(
                    division=division,
                    code=dist_data['code'],
                    defaults={
                        'name': dist_data['name'],
                        'native_name': dist_data.get('native_name', ''),
                        'latitude': dist_data.get('latitude'),
                        'longitude': dist_data.get('longitude'),
                        'shipping_zone': dist_data.get('shipping_zone', 'suburban'),
                        'is_active': True,
                        'is_shipping_available': True,
                    }
                )
                action = 'Created' if created else 'Updated'
                self.stdout.write(f'    {action} district: {district.name} ({district.shipping_zone})')
        
        # Summary
        division_count = Division.objects.filter(country=bangladesh).count()
        district_count = District.objects.filter(division__country=bangladesh).count()
        
        self.stdout.write(self.style.SUCCESS(
            f'\nSuccessfully seeded Bangladesh location data:'
            f'\n  - {division_count} divisions'
            f'\n  - {district_count} districts'
        ))
