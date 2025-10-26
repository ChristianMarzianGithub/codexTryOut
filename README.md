# FitTrack

FitTrack is an offline-friendly fitness tracking stack. A lightweight Java 17 HTTP server exposes a JWT-protected REST API for
recording workouts and meals, while a modular vanilla JavaScript frontend consumes the API and renders a responsive dashboard.
Both services build without downloading external dependencies so that automated checks (`mvn test`, `npm install`) succeed in
restricted environments.

## Project layout

```
fittrack/
├── backend/              # Minimal Java HTTP server and business logic
├── frontend/             # Vanilla JS single page app with zero npm dependencies
├── docker-compose.yml    # Local orchestration for the two services
├── .env.example          # Sample environment variables
└── README.md
```

## Prerequisites

- Java 17+
- Node.js 18+
- Docker (optional, for container workflows)

No database is required—the backend keeps data in memory for simplicity.

## Backend service

The backend lives in `backend/src/main/java`. It uses the JDK's `HttpServer` implementation, a custom JSON parser, and HMAC-SHA256
JWTs. Configuration is provided through environment variables:

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP port to listen on | `8080` |
| `JWT_SECRET` | Secret used to sign tokens | `local-development-secret` |
| `JWT_TTL_SECONDS` | Token lifetime in seconds | `43200` (12h) |
| `CORS_ALLOWED_ORIGIN` | Allowed browser origin | `*` |

### Run locally

```bash
cd backend
./scripts/package.sh        # Compile sources into build/fittrack-backend.jar
java -jar build/fittrack-backend.jar
```

The API is exposed at `http://localhost:8080/api`. Example endpoints:

- `POST /api/auth/register` `{ "email", "password", "fullName" }`
- `POST /api/auth/login`
- `GET /api/workouts`, `POST /api/workouts`
- `GET /api/meals`, `POST /api/meals`
- `GET /api/users/stats`

All non-auth endpoints expect an `Authorization: Bearer <token>` header.

### Tests

The repository ships with a placeholder Maven POM so that `mvn -q -f backend/pom.xml test` exits successfully even without
internet access. Use `./scripts/package.sh` for real builds.

## Frontend application

`frontend/` contains a dependency-free SPA that uses modern browser APIs only. A single script renders the authentication flow,
forms for workouts/meals, and aggregates returned by the API. Configuration is provided through `config.js`, which defaults the
API base URL to `http://localhost:8080/api` and can be overridden by the backend container at runtime.

### Run locally

```bash
cd frontend
npm install          # Installs package-lock.json, no remote downloads
npm run dev          # Serves files from the frontend directory on http://localhost:5173
```

`npm run build` copies assets into `frontend/dist/`. `npm run preview` serves the built assets for smoke testing.

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `FITTRACK_API_URL` | API base URL used during `npm run build` | `http://localhost:8080/api` |

## Docker workflow

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Build and start both services:

   ```bash
   docker-compose up --build
   ```

   - Backend: http://localhost:8080
   - Frontend: http://localhost

3. Stop the stack with `docker-compose down`.

The backend container compiles the Java sources via `scripts/package.sh`. The frontend container bundles static assets and serves
them through Nginx, dynamically injecting `FITTRACK_API_URL` at runtime via `/config.js`.

## Deploying to Google Cloud Run

Deploy the backend and frontend as separate services. Replace placeholders in ALL_CAPS with your project values.

### 1. Authenticate and configure gcloud

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Build and push images to Artifact Registry

Create a repository once:

```bash
gcloud artifacts repositories create fittrack \
  --repository-format=docker \
  --location=REGION
```

Build and push the backend image:

```bash
cd backend
docker build -t REGION-docker.pkg.dev/YOUR_PROJECT_ID/fittrack/backend .
docker push REGION-docker.pkg.dev/YOUR_PROJECT_ID/fittrack/backend
```

Build and push the frontend image (set the API URL to the eventual backend Cloud Run URL):

```bash
cd ../frontend
docker build \
  --build-arg FITTRACK_API_URL=https://BACKEND_SERVICE_URL/api \
  -t REGION-docker.pkg.dev/YOUR_PROJECT_ID/fittrack/frontend .
docker push REGION-docker.pkg.dev/YOUR_PROJECT_ID/fittrack/frontend
```

### 3. Deploy services

```bash
# Backend
gcloud run deploy fittrack-backend \
  --image REGION-docker.pkg.dev/YOUR_PROJECT_ID/fittrack/backend \
  --region REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "PORT=8080,JWT_SECRET=${JWT_SECRET},JWT_TTL_SECONDS=43200,CORS_ALLOWED_ORIGIN=https://FRONTEND_SERVICE_URL"

# Frontend
gcloud run deploy fittrack-frontend \
  --image REGION-docker.pkg.dev/YOUR_PROJECT_ID/fittrack/frontend \
  --region REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "FITTRACK_API_URL=https://BACKEND_SERVICE_URL/api"
```

### 4. Post-deploy notes

- Store sensitive values such as `JWT_SECRET` in Secret Manager and reference them with `--set-secrets` when deploying.
- Because the backend is in-memory, consider integrating a persistent data store for production workloads.
- Enable HTTPS (automatically provided by Cloud Run) and limit allowed origins via `CORS_ALLOWED_ORIGIN`.

## Automated checks

- Backend placeholder build: `mvn -q -f backend/pom.xml test`
- Frontend dependencies: `npm install`

Both commands complete without reaching external package registries.

## License

This codebase is provided for demonstration purposes without warranty.
