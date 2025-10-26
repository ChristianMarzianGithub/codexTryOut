# ClearFlow Plumbing Landing Page

A production-ready, single-page React application with routed subpages for a residential and commercial plumbing company. The landing page warmly greets visitors with "hello" and provides example content that mirrors what real-world plumbing websites typically feature.

## ✨ Features
- Modern React + Vite stack with fast local development and optimized production builds.
- Hero section welcoming visitors with a friendly "Hello" greeting and clear value proposition.
- Dedicated pages for Services, About, Emergency Plumbing, Financing, and Contact inquiries.
- Responsive layout, reusable styling primitives, and SEO-friendly metadata.

## 🛠️ Prerequisites
- [Node.js](https://nodejs.org/) **18.x** or newer (includes npm).

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev -- --host

# 3. Open your browser at http://localhost:5173
```

The `--host` flag allows access from other devices on your network. Vite will display the local and network URLs in the console once the server is running.

## 🏗️ Build for production

```bash
npm run build
npm run preview  # serves the optimized build locally on port 4173
```

The compiled assets will be available in the `dist/` directory, ready to deploy to any static hosting provider or CDN.

## 🧱 Project structure

```
.
├── index.html           # Root HTML template loaded by Vite
├── package.json         # Scripts and dependencies
├── src/
│   ├── App.jsx          # Top-level routing
│   ├── main.jsx         # React entry point
│   ├── components/      # Shared layout components
│   ├── data/            # Example plumbing content
│   ├── pages/           # Routed pages (Home, Services, About, Emergency, Financing, Contact)
│   └── styles/          # Global styling
└── vite.config.js       # Vite configuration with React plugin
```

## 📄 License
This project is provided for demonstration purposes and does not include a commercial license.
