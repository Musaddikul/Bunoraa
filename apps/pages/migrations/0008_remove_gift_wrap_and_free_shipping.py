from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0007_auto'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sitesettings',
            name='gift_wrap_enabled',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='gift_wrap_fee',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='gift_wrap_label',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='free_shipping_threshold',
        ),
    ]