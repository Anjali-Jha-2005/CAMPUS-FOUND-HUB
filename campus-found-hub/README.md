# 🎓 Campus Found Hub

A full-featured campus Lost & Found portal built with React + Vite.

## Project Structure

```
campus-found-hub/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx          # React entry point
    ├── App.jsx           # Router + layout
    ├── index.css         # Global styles & CSS variables
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Navbar.module.css
    │   ├── ItemCard.jsx
    │   └── ItemCard.module.css
    ├── pages/
    │   ├── Home.jsx            # Landing page
    │   ├── Home.module.css
    │   ├── Browse.jsx          # Browse + filter items
    │   ├── Browse.module.css
    │   ├── Report.jsx          # Report lost/found form
    │   ├── Report.module.css
    │   ├── ItemDetail.jsx      # Single item view
    │   ├── ItemDetail.module.css
    │   ├── Dashboard.jsx       # Stats + manage all listings
    │   └── Dashboard.module.css
    ├── hooks/
    │   └── useItems.js         # localStorage-backed data store
    └── utils/
        └── helpers.js          # Constants, formatters
```

## Features

- 🔍 **Report lost items** with full details
- ✅ **Post found items** to reunite with owners
- 🔎 **Browse & filter** by type, category, location, status, keyword
- 📋 **Item detail view** with contact & resolve actions
- 📊 **Dashboard** with live stats and manage all listings
- 💾 **Persistent storage** via localStorage (no backend needed)
- 📱 **Responsive** — works on mobile & desktop

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 18** + **React Router v6**
- **Vite** (fast dev server + bundler)
- **CSS Modules** (scoped styles, no class conflicts)
- **Lucide React** (icons)
- **localStorage** (zero-backend data persistence)
- **Google Fonts** — Syne + DM Sans
