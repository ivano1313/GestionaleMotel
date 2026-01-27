# Gestione Docker

## Setup Docker (WSL2 senza Docker Desktop)

```bash
# Installa Docker Engine
sudo apt update && sudo apt install docker.io docker-compose

# Avvia Docker
sudo service docker start

# (Opzionale) Permetti uso senza sudo
sudo usermod -aG docker $USER
```

## Avvio MariaDB con Docker

```bash
# Avvia container MariaDB
docker run -d --name mariadb-motel \
  -e MYSQL_ROOT_PASSWORD=changeme_root \
  -e MYSQL_DATABASE=gestionale \
  -p 3306:3306 \
  mariadb:10

# Oppure usa docker-compose (consigliato)
docker-compose up -d
```

## Gestione Docker e Volumi

| Comando | Effetto sui dati |
|---------|------------------|
| `docker-compose up -d` | Avvia container (dati preservati) |
| `docker-compose down` | Ferma container (dati preservati) |
| `docker-compose down -v` | Ferma e **CANCELLA** tutti i dati |
| `docker start mariadb-motel` | Riavvia container esistente |
| `docker stop mariadb-motel` | Ferma container |

**Volume dati:** `gestionale_motel_db`

**Attenzione:** Non usare mai `-v` se vuoi mantenere i dati del database.

## Comandi Utili

```bash
docker ps                                           # Container attivi
docker logs mariadb-motel                           # Log del container
docker exec -it mariadb-motel mysql -u root -p      # Accedi al DB
```
