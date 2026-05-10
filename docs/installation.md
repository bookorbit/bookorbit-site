# Installation

BookOrbit runs in Docker. The only local dependency is Docker itself. A standard Compose file gets you running in under five minutes.

## Requirements

| Requirement | Minimum |
|-------------|---------|
| OS | Any Linux distro, macOS, or Windows with WSL2 |
| CPU | 1 core (2+ recommended) |
| RAM | 512 MB free (1 GB+ recommended) |
| Disk | Space for your book files + ~50 MB for the app |
| Docker | Latest stable ([install guide](https://docs.docker.com/get-docker/)) |
| Docker Compose | v2.0+ (included with Docker Desktop) |

Any modern browser works - Chrome, Firefox, Safari, Edge.

## Install

### Create the install folder

Pick a location on your server for BookOrbit to live. Everything: config, database, and app data, stays inside this folder.

```bash
mkdir bookorbit && cd bookorbit
mkdir -p books data/app data/postgres
curl -fsSLo .env https://raw.githubusercontent.com/neonsolstice/bookorbit/main/.env.example
curl -fsSLo docker-compose.yml https://raw.githubusercontent.com/neonsolstice/bookorbit/main/docker-compose.yml
```

Edit `.env` before starting. At minimum, set these values:

```dotenv
# The address you will use to open BookOrbit.
# Use your domain if you have one, otherwise use your server IP and port.
APP_URL=http://your-server-ip:3000

# The folder on your server where your book files live.
# This folder appears as /books inside BookOrbit.
BOOKS_HOST_PATH=./books

POSTGRES_PASSWORD=use-a-strong-random-password
JWT_SECRET=use-a-long-random-secret
SETUP_BOOTSTRAP_TOKEN=use-a-random-setup-token
```

::: tip Generating secrets
```bash
openssl rand -hex 24   # use for POSTGRES_PASSWORD
openssl rand -hex 32   # use for JWT_SECRET
openssl rand -hex 16   # use for SETUP_BOOTSTRAP_TOKEN
```
:::

### Start BookOrbit

```bash
docker compose up -d
```

Docker will pull the images and start both the database and app. Wait about 30 seconds on first startup.

### Complete setup

Open your browser and go to `http://your-server-ip:3000`.

You'll be redirected to a setup page - create your administrator account here. You'll need your `SETUP_BOOTSTRAP_TOKEN` from `.env`.

---

## After Installation

You're in. Next, set up your first library so BookOrbit knows where your books live.

➜ [Creating a Library](/creating-a-library)

## File Permissions

On Linux and NAS installs, Docker uses numeric user and group IDs when it reads or writes mounted folders.

BookOrbit runs as `PUID:PGID` from your `.env` file. The default is `1000:1000`.

```dotenv
PUID=1000
PGID=1000
BOOKS_HOST_PATH=/mnt/media/books
```

Your `BOOKS_HOST_PATH` must be readable by that user. It must also be writable if you want BookOrbit to upload books, finalize Book Dock files, or write metadata back to files.

To check who owns your book folder:

```bash
ls -ldn /mnt/media/books
```

If your media user is different, set `PUID` and `PGID` to that user:

```bash
id your-media-user
```

Then restart:

```bash
docker compose up -d
```

::: tip What about `data/app`?
BookOrbit automatically repairs ownership for the app data folder mounted at `/data`. It does not change ownership of your book folder, because that may be an existing media library shared with other apps.
:::

Common signs of a permission issue:

- A scan finishes but finds no books
- Uploads fail when saving into `/books`
- Book Dock cannot finalize files
- Logs mention `EACCES`, `permission denied`, or `not writable`

## External Database

If you already have a PostgreSQL server running (like on a NAS or a managed service), you can use it instead of the built-in Docker container.

### 1. Requirements

- **PostgreSQL 16 or newer**
- **Three extensions** installed on your database: `uuid-ossp`, `pg_trgm`, and `vector` (pgvector)
- A dedicated database and user for BookOrbit

### 2. Update your environment file

Add `DATABASE_URL` to your `.env` file, replacing it with your database details:

```dotenv
DATABASE_URL=postgres://bookorbit:your-password@192.168.1.10:5432/bookorbit
```

### 3. Modify docker-compose.yml

Remove the `postgres:` service block entirely. Also remove this block from the `app:` service because the app no longer waits for the bundled database:

```yaml
depends_on:
  postgres:
    condition: service_healthy
```

## Configuration

All configuration is done through the `.env` file. After changing any value, restart the stack:

```bash
docker compose up -d
```

### Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_IMAGE` | Yes | - | Docker image to run |
| `APP_URL` | Yes | - | Full URL where BookOrbit is accessible |
| `POSTGRES_USER` | Yes | - | Database username |
| `POSTGRES_PASSWORD` | Yes | - | Database password |
| `POSTGRES_DB` | Yes | - | Database name |
| `JWT_SECRET` | Yes | - | Secret for signing login tokens |
| `SETUP_BOOTSTRAP_TOKEN` | Yes | - | One-time token for initial setup |
| `APP_PORT` | No | `3000` | Host port BookOrbit listens on |
| `BOOKS_HOST_PATH` | No | `./books` | Host folder mounted as `/books` in the container |
| `PUID` | No | `1000` | UID for files written by the app (useful on NAS) |
| `PGID` | No | `1000` | GID for files written by the app (useful on NAS) |
| `NODE_MAX_OLD_SPACE_SIZE` | No | `2048` | Node.js heap limit in MB |
| `DATABASE_URL` | No | Built from bundled Postgres settings | Full PostgreSQL connection string for an external database |
| `POSTGRES_HOST` | No | `postgres` | Database hostname (only for external DB) |
| `POSTGRES_PORT` | No | `5432` | Database port (only for external DB) |

### Reverse proxy

If you're using Nginx, Caddy, or Traefik, point it at `localhost:3000` and set `APP_URL` to your public domain with HTTPS.

**Caddy example:**
```
books.example.com {
    reverse_proxy localhost:3000
}
```

### SMTP and OIDC

Both are configured inside the app - no environment variables needed. Log in as an administrator and go to **Settings > Email** or **Settings > OIDC / SSO**.

## Updating

```bash
docker compose pull
docker compose up -d
```

The app handles database migrations automatically on startup.
