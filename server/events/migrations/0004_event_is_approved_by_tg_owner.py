# Generated by Django 4.2.5 on 2023-10-07 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_event_tg_owner_alter_event_tg_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='is_approved_by_tg_owner',
            field=models.BooleanField(default=False),
        ),
    ]
