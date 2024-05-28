# migrations/0002_add_last_login.py

from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):

    dependencies = [
        ('resumes', '0001_initial'), 
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='last_login',
            field=models.DateTimeField(blank=True, null=True, default=django.utils.timezone.now),
        ),
    ]
