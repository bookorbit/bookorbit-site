---
title: "Installation"
description: "Install BookOrbit with Docker Compose, configure storage and permissions, and keep it updated."
---

BookOrbit runs in Docker. The only host dependency is Docker itself. The bundled Compose stack starts BookOrbit and PostgreSQL with persistent storage on your server.

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

Pick a location on your server for BookOrbit to live. The Compose file and default persistent data paths stay inside this folder. You can point `BOOKS_HOST_PATH` elsewhere if your library already exists in another location.

```bash
mkdir bookorbit && cd bookorbit
mkdir -p books data/app data/postgres
curl -fsSLo .env https://raw.githubusercontent.com/bookorbit/bookorbit/main/.env.example
curl -fsSLo docker-compose.yml https://raw.githubusercontent.com/bookorbit/bookorbit/main/docker-compose.yml
```

Edit `.env` before starting. At minimum, set these values:

```dotenv
# Docker image to run. The default in the downloaded template is fine for most installs.
APP_IMAGE=ghcr.io/bookorbit/bookorbit:latest

# The address you will use to open BookOrbit.
# Direct LAN access: http://your-server-ip:3000
# Behind a reverse proxy with a domain: https://books.example.com
APP_URL=http://your-server-ip:3000

# The folder on your server where your book files live.
# This folder appears as /books inside BookOrbit.
BOOKS_HOST_PATH=./books

# POSTGRES_USER and POSTGRES_DB default to "bookorbit" in the downloaded template.
# Change POSTGRES_PASSWORD to something strong.
POSTGRES_PASSWORD=use-a-strong-random-password
JWT_SECRET=use-a-long-random-secret
SETUP_BOOTSTRAP_TOKEN=use-a-random-setup-token
```

:::tip[Generating secrets]
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

## Unraid Installation

BookOrbit is available on Unraid through [Community Applications](https://ca.unraid.net) as two templates: `bookorbit` and `bookorbit-db` (PostgreSQL + pgvector). Search **BookOrbit** in the Apps tab to install both.

The two containers need to be able to reach each other. There are two ways to set that up:

- **Host IP and Port** (default, simplest) - both templates use Unraid's default `bridge` network. Point the app at the database's container IP and its exposed port.
- **Custom Docker Network** - attach both containers to a shared custom network and reach the database by container name instead of by IP.

### Install the database first

Search for **bookorbit-db** in the Apps tab and install it first. Fill in:

- **Port** - host port used to reach the database, `5432` by default. Note this value; you'll need it for the app's **Postgres Port** field
- **Postgres User** / **Postgres DB** - defaults of `bookorbit` are fine
- **Postgres Password** - generate a strong value (see [Generating secrets](#install) above)
- **Database Storage** - defaults to `/mnt/user/appdata/bookorbit-db`

Apply, and wait about 20-30 seconds for Postgres to finish initializing before starting the app container.

### Install the app

Search for **bookorbit** and install it. Fill in:

- **WebUI Port** - `3000` by default
- **Books Folder** - point at your existing books share, e.g. `/mnt/user/data/media/books`
- **App URL** - `http://your-server-ip:3000`, or your reverse-proxy domain
- **Postgres User / Password / DB** - must exactly match what you set on `bookorbit-db`
- **Postgres Host** - the `bookorbit-db` container's IP address (find it under **Docker → Container IP**), or the container name `bookorbit-db` if you're using a custom network
- **Postgres Port** - must match the **Port** value you set on `bookorbit-db`
- **JWT Secret** and **Setup Bootstrap Token** - generate your own random values
- **PUID / PGID** - match the user/group that owns your Books Folder

Less commonly changed variables (Book Dock path, fix-permissions toggle, Node heap size, log level) are available under the template's **Show more settings...** section.

:::tip[Using a custom Docker network instead]
To reach the database by container name rather than IP, open the Unraid terminal and run:

```bash
docker network create bookorbit
```

Then edit both containers (**Docker → click the container → Edit**), set **Network Type** to the `bookorbit` network you just created, and apply. Set the app's **Postgres Host** field to `bookorbit-db`.

Container IPs on the default `bridge` network can change on restart, so a custom network is more reliable long-term if you're not using host networking.
:::

:::tip[Connecting an external database on Unraid]
If you'd rather use an external PostgreSQL server instead of the bundled `bookorbit-db` container, point **Postgres Host** and **Postgres Port** at that server instead. See [External Database](#external-database) below for the extension requirements.
:::

### Complete setup and updates

Once both containers are running, open your **App URL** and complete setup using your Setup Bootstrap Token, the same as any other install.

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

:::tip[What about `data/app`?]
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
- **Four extensions** installed on your database: `uuid-ossp`, `pg_trgm`, `unaccent`, and `vector` (pgvector)
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

| Variable | Required | Template/default | Description |
|----------|----------|------------------|-------------|
| `APP_IMAGE` | Yes | `ghcr.io/bookorbit/bookorbit:latest` | Docker image to run |
| `APP_URL` | Yes | - | Full URL where BookOrbit is accessible |
| `POSTGRES_USER` | Yes | `bookorbit` | Database username |
| `POSTGRES_PASSWORD` | Yes | - | Database password |
| `POSTGRES_DB` | Yes | `bookorbit` | Database name |
| `JWT_SECRET` | Yes | - | Secret for signing login tokens |
| `SETUP_BOOTSTRAP_TOKEN` | Yes | - | One-time token for initial setup |
| `APP_PORT` | No | `3000` | Host port mapped to the container |
| `PORT` | No | `3000` | Internal container port. Only change if `APP_PORT` and `PORT` need to differ |
| `BOOKS_HOST_PATH` | No | `./books` | Host folder mounted as `/books` in the container |
| `PUID` | No | `1000` | UID for files written by the app (useful on NAS) |
| `PGID` | No | `1000` | GID for files written by the app (useful on NAS) |
| `BOOKORBIT_FIX_PERMISSIONS` | No | `true` | Set to `false` if your platform manages `/data` ownership externally |
| `NODE_MAX_OLD_SPACE_SIZE` | No | `2048` in `.env` | Node.js heap limit in MB. Use `auto` for container-aware detection or raise it for very large libraries |
| `LIBRARY_BROWSE_ROOT` | No | `/` | Root shown by the library folder picker. Set to `/books` to hide other container folders |
| `BOOK_DOCK_PATH` | No | `/data/book-dock` | Book Dock staging folder inside the container |
| `DATABASE_URL` | No | Built from bundled Postgres settings | Full PostgreSQL connection string for an external database |
| `POSTGRES_HOST` | No | `postgres` | Database hostname. Override when using an external DB |
| `POSTGRES_PORT` | No | `5432` | Database port |
| `CLIENT_URL` | No | Same as `APP_URL` | Frontend URL when the client is served from a different domain |
| `EMAIL_ENCRYPTION_KEY` | No | - | Encrypts stored SMTP credentials at rest. Recommended if you configure email |
| `MIGRATION_ENCRYPTION_KEY` | No | - | Encrypts stored migration source credentials. Recommended if you use migrations |
| `LOG_LEVEL` | No | `info` | Log verbosity. Set to `debug` for detailed output |
| `OIDC_ALLOW_LOCAL_ISSUERS` | No | `false` | Allows OIDC discovery on private addresses. Enable only on a trusted network |
| `CSP_ALLOW_CLOUDFLARE_INSIGHTS` | No | `false` | Allows the Cloudflare Web Analytics beacon in the content security policy |

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
