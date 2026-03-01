from django.core.management.base import BaseCommand
from requests_app.models import MaterialType


class Command(BaseCommand):
    help = "Cria materiais iniciais (se não existirem)"

    def handle(self, *args, **options):
        base = ["Papel", "Plástico", "Vidro", "Metal"]
        created = 0
        for name in base:
            obj, was_created = MaterialType.objects.get_or_create(name=name)
            created += 1 if was_created else 0

        self.stdout.write(self.style.SUCCESS(f"OK. Materiais criados: {created}"))