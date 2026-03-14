# docker-app

Przykladowy stack uruchamiany przez Docker Compose:

- backend: Node.js + Express + PostgreSQL
- frontend: statyczna aplikacja HTML/JS przez Nginx
- database: PostgreSQL z inicjalizacja tabeli i danymi startowymi

## Uruchomienie

```bash
docker compose up --build
```

## Adresy

- frontend: http://localhost:8080
- backend API: http://localhost:3000

## Przykladowe endpointy backendu

- GET /api/health
- GET /api/messages
- POST /api/messages

Przyklad POST:

```bash
curl -X POST http://localhost:3000/api/messages \
	-H "Content-Type: application/json" \
	-d '{"content":"Wiadomosc testowa"}'
```

## Struktura

- app.js - backend
- Dockerfile - obraz backendu
- frontend/ - frontend i konfiguracja Nginx
- db/init/01-init.sql - inicjalizacja bazy
- docker-compose.yml - konfiguracja calego stacku
