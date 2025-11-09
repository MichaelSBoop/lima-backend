# Docker Setup for Lima Mobile Bank

This document explains how to run the Lima Mobile Bank application using Docker.

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)

## Quick Start

### Production Build

Build and run the production container:

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

The application will be available at `http://localhost:5173`

### Development Mode

Run in development mode with hot reload:

```bash
# Build and start development containers
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop containers
docker-compose -f docker-compose.dev.yml down
```

## Manual Docker Commands

### Build the Docker Image

```bash
# Production build
docker build -t lima-mobile-bank:latest .

# Development build
docker build -f Dockerfile.dev -t lima-mobile-bank:dev .
```

### Run the Container

```bash
# Production
docker run -d \
  -p 5173:5173 \
  -e NODE_ENV=production \
  -e PORT=5173 \
  --name lima-mobile-bank \
  lima-mobile-bank:latest

# Development
docker run -d \
  -p 5173:5173 \
  -v $(pwd):/app \
  -e NODE_ENV=development \
  -e PORT=5173 \
  --name lima-mobile-bank-dev \
  lima-mobile-bank:dev
```

## Environment Variables

You can customize the application using environment variables:

- `PORT` - Server port (default: 5173)
- `NODE_ENV` - Environment mode (development/production)
- `DATABASE_URL` - PostgreSQL connection string (optional, uses in-memory storage if not provided)

## Database

The docker-compose setup includes a PostgreSQL database. To use an external database, set the `DATABASE_URL` environment variable:

```bash
export DATABASE_URL=postgresql://user:password@host:5432/database
docker-compose up -d
```

## Troubleshooting

### View Container Logs

```bash
docker-compose logs -f app
```

### Access Container Shell

```bash
docker-compose exec app sh
```

### Rebuild After Changes

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (database data)
docker-compose down -v

# Remove images
docker rmi lima-mobile-bank:latest
```
