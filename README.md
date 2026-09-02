# TwinX — Digital Twin Intelligence Platform

A high-fidelity, animated dashboard prototype inspired by the TCS TwinX "Pipelines" experience. Built with React, TypeScript, Tailwind CSS v4, Framer Motion and Recharts.

## Features

- **Sidebar Navigation** — collapsible, glowing hover states, Platform (Digital Twins, Live Features, Use Cases, Pipelines, Studio) and Operations (Model Drift, Monitoring — coming soon) groups.
- **Digital Twins** — entity/ontology cards with hover-expand attributes and a synthetic data preview modal (sample rows + chart).
- **Use Cases** — expandable cards with derived-feature/scenario counts, Download/Delete/Open Pipeline actions, and an assistant-guided "Upload Use Case" flow with AI keyword suggestions.
- **Pipelines** — animated node graph (twin inputs → calculation → KPI → ML model → Monte Carlo roll-up) with flowing data-stream edges, live status indicators, a Run animation, Scenario Builder, and Execution History.
- **Node Detail Panel** — Details / Execution / Metrics tabs with formulas, source/alignment/base entity, count-up metrics, and an animated outcome distribution curve.
- **Causal Graph** — "Causal approximation of engagement" with animated coefficient arrows and a direct/mediated/total effects table.
- **AI Chatbot Assistant** — floating, context-aware assistant that reacts to whatever you're doing across the app (selecting a node, opening a use case, running a pipeline).
- **Theme Toggle** — smooth light/dark switch with a full gradient (blue → teal → purple) palette in both modes.
- Fully responsive layout with a collapsible sidebar on small screens.

All data is synthetic and seeded deterministically for a stable MVP preview.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Build

```bash
npm run build
```

## Tech stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://motion.dev/) for animation
- [Recharts](https://recharts.org/) for charts
- [Lucide](https://lucide.dev/) for icons
