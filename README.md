# ClearFlow Plumbing Landing Page

A production-ready marketing site for **ClearFlow Plumbing Co.** built with vanilla React, React Router, and a lightweight
Webpack toolchain. The landing experience includes routed pages for services, about, emergency support, financing, and
contact—in addition to a welcoming "Hello" hero for new visitors.

## ✨ Features

- Modern single-page application with client-side routing and smooth navigation
- Tailored copy for plumbing services, emergency dispatch, financing, and customer testimonials
- Responsive layout with reusable components (header, footer, cards, forms)
- Zero Vite dependency—pure React + Webpack/Babel setup for straightforward builds

## 🛠 Tech Stack

- React 18 with functional components
- React Router DOM v6 for multi-page navigation
- Webpack 5 + Babel for bundling and modern JavaScript compilation

## 🚀 Getting Started

These commands assume you already have **Node.js 18+** and **npm 9+** installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (http://localhost:3000)
npm start
```

The development server automatically opens your browser and supports fast refresh. Any unmatched route is redirected back to
the SPA thanks to `historyApiFallback`.

### Production build

```bash
# Generate optimized assets in the dist/ folder
npm run build
```

You can deploy the `dist/` folder with any static host (e.g., Netlify, Vercel, AWS S3 + CloudFront).

## 📁 Project Structure

```
.
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── components/
│   │   ├── Footer.js
│   │   └── Header.js
│   ├── data/
│   │   └── siteContent.js
│   ├── index.js
│   ├── pages/
│   │   ├── AboutPage.js
│   │   ├── ContactPage.js
│   │   ├── EmergencyPage.js
│   │   ├── FinancingPage.js
│   │   ├── HomePage.js
│   │   └── ServicesPage.js
│   └── styles/
│       └── global.css
├── webpack.config.js
├── package.json
└── README.md
```

## ✅ Available Scripts

- `npm start` – run webpack-dev-server with hot reloading on port 3000
- `npm run build` – create a production build in `dist/`

## 🧱 Browser Support

The site targets modern evergreen browsers (`>0.25%, not dead`). Adjust the Babel configuration if you need legacy support.

## 🙌 Credits

Designed and developed by ClearFlow Plumbing Co. marketing team. Feel free to customize the copy, branding, and imagery for
your own plumbing business.
