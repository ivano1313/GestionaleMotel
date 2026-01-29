# Deploy in Produzione - Gestionale Motel

Guida passo-passo per il deploy su server Windows con Docker.

## Prerequisiti

- Windows 10/11 o Windows Server con Docker Desktop
- Git
- Dominio (opzionale, per HTTPS)

## 1. Preparazione Server

### Installa Docker Desktop
1. Scarica da https://www.docker.com/products/docker-desktop
2. Installa e riavvia
3. Verifica: `docker --version`

### Clona il repository
```bash
git clone https://github.com/tuouser/gestionale-motel.git
cd gestionale-motel
```

## 2. Configurazione

### Crea file .env
```bash
copy .env.example .env
```

### Modifica .env con le tue credenziali
```properties
# Database
DB_ROOT_PASSWORD=una_password_sicura_per_root
DB_PASSWORD=una_password_sicura_per_app

# JWT - Genera chiave sicura:
# PowerShell: [Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
JWT_SECRET=chiave_generata_casualmente_di_64_caratteri

# CORS - Il tuo dominio
CORS_ORIGINS=https://motel.tuodominio.it
```

## 3. Certificati SSL

### Opzione A: Certificato self-signed (solo test)
```bash
mkdir nginx\ssl
cd nginx\ssl

# Genera certificato (PowerShell)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem -out fullchain.pem \
  -subj "/CN=localhost"
```

### Opzione B: Let's Encrypt (produzione)
1. Punta il dominio al server
2. Usa certbot o altro tool ACME
3. Copia i certificati in `nginx/ssl/`

## 4. Build Frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

Il build crea `frontend/dist/frontend/browser/`

## 5. Avvio

### Primo avvio (build + start)
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Avvii successivi
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Verifica stato
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## 6. Verifica

1. Apri https://localhost (o il tuo dominio)
2. Dovresti vedere la pagina di login
3. Accedi con: admin / admin123
4. Verifica la dashboard

### Health check
```bash
curl http://localhost/api/health
```

## 7. Gestione

### Ferma i servizi
```bash
docker-compose -f docker-compose.prod.yml down
```

### Visualizza log
```bash
# Tutti i servizi
docker-compose -f docker-compose.prod.yml logs -f

# Solo backend
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Backup database
```bash
docker exec gestionale-motel-db mysqldump -u root -p gestionale > backup/backup_$(date +%Y%m%d).sql
```

### Restore database
```bash
docker exec -i gestionale-motel-db mysql -u root -p gestionale < backup/backup_20260129.sql
```

## 8. Aggiornamenti

```bash
# Scarica aggiornamenti
git pull

# Rebuild e restart
docker-compose -f docker-compose.prod.yml up -d --build
```

## Troubleshooting

### Il backend non parte
```bash
# Controlla i log
docker-compose -f docker-compose.prod.yml logs backend

# Verifica che il DB sia pronto
docker-compose -f docker-compose.prod.yml logs mariadb
```

### Errore CORS
Verifica che `CORS_ORIGINS` nel file `.env` includa il dominio corretto.

### Errore SSL
Verifica che i certificati siano in `nginx/ssl/` con i nomi corretti:
- `fullchain.pem`
- `privkey.pem`

### Database non accessibile
```bash
# Verifica che il container sia running
docker ps

# Entra nel container DB
docker exec -it gestionale-motel-db mysql -u root -p
```

## Architettura Produzione

```
Internet
    │
    ▼
┌─────────────────────────────────────┐
│  Nginx (:80/:443)                   │
│  - Reverse proxy                    │
│  - SSL termination                  │
│  - Serve frontend static            │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Backend Spring Boot (:8080)        │
│  - API REST                         │
│  - JWT Authentication               │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  MariaDB (:3306)                    │
│  - Volume persistente               │
└─────────────────────────────────────┘
```
