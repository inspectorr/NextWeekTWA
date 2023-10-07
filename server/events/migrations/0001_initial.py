# Generated by Django 4.2.5 on 2023-10-06 23:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('bot', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.TextField(blank=True, null=True)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('tg_author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='author_of_events', to='bot.telegramuser', verbose_name='Author')),
                ('tg_participants', models.ManyToManyField(blank=True, to='bot.telegramuser', verbose_name='Participants')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]