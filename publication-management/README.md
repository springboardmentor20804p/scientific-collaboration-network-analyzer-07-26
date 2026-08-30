# Publication Management

A standalone React + Vite + TypeScript + Tailwind CSS v4 application for managing scientific publications.

## Features

- 📋 **Full CRUD** – Add, view, edit, and delete publications
- 🔍 **Search** – Filter by title, author, journal, or keyword
- 🏷️ **Filter by Type** – Journal, Conference, Book Chapter, Preprint
- 🔖 **Filter by Status** – Published, Submitted, Under Review, Draft
- 📊 **Sort** – By year, citations, or title (ascending / descending)
- 🌙 **Dark Mode** – Persisted to localStorage
- 🎨 **Premium UI** – Glassmorphism, micro-animations, gradient accents
- 📬 **Toast notifications** – Feedback on every action

## Getting Started

### Prerequisites

- Node.js 18+ (or use `mise` with the included `.mise.toml`)
- pnpm (recommended) or npm

### Install & Run

```bash
pnpm install
pnpm dev
```

Or with npm:

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── data/
│   └── publications.ts      # Publication type + 20 mock records
├── contexts/
│   └── PublicationContext.tsx  # State management (CRUD + dark mode + toasts)
├── components/
│   └── Toast.tsx            # Toast notification component
├── pages/
│   └── PublicationsPage.tsx # Main publications page
├── App.tsx                  # Root component + dark mode toggle
├── main.tsx                 # React entry point
└── index.css                # Tailwind v4 + design tokens
```

## Stack

| | |
|---|---|
| **Framework** | React 19 |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Language** | TypeScript 5 |
| **Icons** | Lucide React |
