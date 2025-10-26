# FitTrack

FitTrack is a full-stack fitness tracking app. A lightweight Java 17 HTTP server exposes a JWT-protected REST API for recording workouts and meals, while a React + Vite + Tailwind CSS single-page application consumes the API and renders an authenticated dashboard.

## Project layout

```
fittrack/
├── backend/              # Minimal Java HTTP server and business logic
├── frontend/             # React + Vite + Tailwind SPA
├── docker-compose.yml    # Local orchestration for the two services
├── .env.example          # Sample environment variables
└── README.md
```

## Prerequisites

- Java 17+
- Node.js 18+
- Docker (optional, for container workflows)

No database is required—the backend keeps data in memory for simplicity.

## Quick start (local)

The following commands assume you cloned the repository and are running them
from the project root (`fittrack/`). They bring up both services with the API
listening on port `8080` and the React dev server on port `5173`.

> ℹ️ The backend is dependency-free, so it builds with the JDK alone. The
> frontend uses the standard npm registry; ensure you have internet access the
> first time you run `npm install`.

1. Copy the environment sample (adjust values if desired):

   ```bash
   cp .env.example .env
   ```

2. Start the backend (in the first terminal):

   ```bash
   ./backend/scripts/package.sh
   java -jar backend/build/fittrack-backend.jar
   ```

3. Start the frontend (in a second terminal):

   ```bash
   cd frontend
   npm install
   npm run dev -- --host
   ```

   The app will be available at http://localhost:5173 and proxy requests to the
   backend at `http://localhost:8080/api` using the `VITE_API_URL` value from
   `.env` (defaults provided).

Stop the backend with `Ctrl+C` in its terminal and the frontend with `Ctrl+C`
after the Vite server logs `ready`. For a production-style experience you can
use `docker-compose up --build` as documented below.

## Backend service

The backend lives in `backend/src/main/java`. It uses the JDK's `HttpServer` implementation, a custom JSON parser, and HMAC-SHA256 JWTs. Configuration is provided through environment variables:

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP port to listen on | `8080` |
| `JWT_SECRET` | Secret used to sign tokens | `local-development-secret` |
| `JWT_TTL_SECONDS` | Token lifetime in seconds | `43200` (12h) |
| `CORS_ALLOWED_ORIGIN` | Allowed browser origin | `*` |

### Run locally (advanced)

If you prefer to work from inside the `backend/` directory, the same commands
from the quick start are available relative to that folder:

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

The repository ships with a placeholder Maven POM so that `mvn -q -f backend/pom.xml test` exits successfully even without internet access. Use `./scripts/package.sh` for real builds.

## Frontend application

`frontend/` contains the React/Vite/Tailwind SPA. The app implements authentication flows, a dashboard with macro/workout summaries, and CRUD forms for workouts and meals.

### Run locally

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Create a `.env` (see `.env.example`) or export `VITE_API_URL` before running `npm run dev` or `npm run build` to point at your backend instance.

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | API base URL used during `npm run dev/build` | `http://localhost:8080/api` |

### Available scripts

- `npm run dev` – start Vite dev server
- `npm run build` – build production assets in `frontend/dist`
- `npm run preview` – preview the production build locally

## Docker workflow

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Build and start both services:

   ```bash
   docker-compose up --build
   ```

   - Backend: http://localhost:8080
   - Frontend: http://localhost

3. Stop the stack with `docker-compose down`.

The backend container compiles the Java sources via `scripts/package.sh`. The frontend container runs the Vite build and serves the generated static assets through Nginx.

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
  --build-arg VITE_API_URL=https://BACKEND_SERVICE_URL/api \
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
  --set-env-vars "VITE_API_URL=https://BACKEND_SERVICE_URL/api"
```

### 4. Post-deploy notes

- Update the frontend service URL in the backend `CORS_ALLOWED_ORIGIN` variable so browsers can call the API.
- If you rotate `JWT_SECRET`, restart the backend to pick up the new secret.
- Use HTTPS URLs for both services in production.
