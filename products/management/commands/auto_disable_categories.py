from django.core.management.base import BaseCommand
from django.utils import timezone
from products.models import Category

class Command(BaseCommand):
    help = "Auto-disable categories when auto_disable_until datetime has passed"

    def handle(self, *args, **kwargs):
        now = timezone.now()
        categories_to_disable = Category.objects.filter(
            auto_disable_until__isnull=False,
            auto_disable_until__lt=now,
            active=True
        )
        count = categories_to_disable.count()
        if count == 0:
            self.stdout.write("No categories to auto-disable.")
            return

        for category in categories_to_disable:
            category.active = False
            category.save()
            self.stdout.write(f"Disabled category '{category.name}' and descendants.")

        self.stdout.write(f"Total {count} categories disabled.")
