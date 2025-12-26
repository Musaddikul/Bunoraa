# Generated migration to restore missing historical state
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0006_remove_sociallink_icon_svg_alter_sociallink_icon"),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='gift_wrap_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='gift_wrap_fee',
            field=models.DecimalField(default=0, max_digits=10, decimal_places=2),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='gift_wrap_label',
            field=models.CharField(default='', max_length=100),
        ),

    ]
