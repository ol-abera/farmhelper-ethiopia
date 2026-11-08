from django.core.management.base import BaseCommand
from crops.models import Crop
from locations.models import Region


class Command(BaseCommand):
    help = 'Seed initial crop and region data for FarmHelper Ethiopia'

    def handle(self, *args, **options):
        maize, created = Crop.objects.get_or_create(
            name='Maize',
            defaults={
                'scientific_name': 'Zea mays',
                'description': 'Maize (corn) is a major staple crop in Ethiopia, widely grown by smallholder farmers especially in Oromia and other highland and mid-altitude areas.',
                'suitable_conditions': 'Prefers well-drained soils, moderate rainfall (500–1200 mm). Grows well at altitudes 1500–2400 m in many Ethiopian regions. [Sample demo information – verify with local agricultural offices.]',
                'planting_period': 'Main season: typically June–July depending on region and onset of rains. [Demo data]',
                'growth_stages': 'Germination, vegetative growth, tasseling, silking, grain filling, maturity. [Demo data]',
                'harvest_period': 'Usually 4–6 months after planting depending on variety. [Demo data]',
                'recommended_practices': 'Use certified seed where available, appropriate spacing, timely weeding, and soil testing when possible. Consult local extension officers for variety recommendations. [Sample content only]',
                'is_active': True,
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Maize crop: {"created" if created else "exists"}'))

        oromia, created = Region.objects.get_or_create(
            name='Oromia',
            defaults={
                'name_om': 'Oromiyaa',
                'name_am': 'ኦሮሚያ',
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Region Oromia: {"created" if created else "exists"}'))

        # A few more sample regions
        for name, om, am in [
            ('Amhara', 'Amaaraa', 'አማራ'),
            ('SNNPR', 'Kibba', 'ደቡብ'),
            ('Tigray', 'Tigraay', 'ትግራይ'),
            ('Addis Ababa', 'Finfinnee', 'አዲስ አበባ'),
        ]:
            Region.objects.get_or_create(name=name, defaults={'name_om': om, 'name_am': am})

        self.stdout.write(self.style.SUCCESS('Seed data complete.'))
