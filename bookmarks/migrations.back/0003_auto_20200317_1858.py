# Generated by Django 3.0.4 on 2020-03-17 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books_cbv', '0002_auto_20200317_1849'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sitebookmark',
            name='name',
            field=models.CharField(max_length=8000),
        ),
        migrations.AlterField(
            model_name='sitebookmark',
            name='url',
            field=models.CharField(max_length=3000),
        ),
    ]
