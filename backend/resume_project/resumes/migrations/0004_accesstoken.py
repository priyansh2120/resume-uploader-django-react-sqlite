# Generated by Django 5.0.6 on 2024-05-28 08:26

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resumes', '0003_remove_user_last_login_alter_resume_domainknowledge_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AccessToken',
            fields=[
                ('access_token', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('refresh_token', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='resumes.user')),
            ],
        ),
    ]
