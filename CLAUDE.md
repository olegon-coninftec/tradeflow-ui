# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start dev server at http://localhost:3000
npm test         # Run tests in watch mode
npm test -- --watchAll=false  # Run tests once (CI mode)
npm test -- --testPathPattern="App"  # Run a single test file
npm run build    # Production build
```

## Architecture

This is a single-page React app (Create React App) that serves as a frontend for the TradeFlow platform — a Kafka + Cassandra + Spring Boot trade processing system.

**Backend dependency:** The app expects a REST API at `http://localhost:8080/api/trades` (hardcoded in `src/App.js:4`). The backend must be running for any data to load.

**API endpoints used:**
- `GET /api/trades/symbol/:symbol` — fetch trades by stock symbol
- `GET /api/trades/trader/:traderId` — fetch trades by trader ID
- `POST /api/trades` — submit a new trade

**`src/App.js`** is the entire application — there are no separate component files. It contains:
- Inline style objects (no CSS framework, no CSS modules)
- `StatusBadge` and `SideBadge` — small presentational components
- `TradeTable` — renders the trade list with columns: Trade ID, Symbol, Side, Qty, Price, Value, Exchange, Status, Time
- `App` (default export) — main component managing all state: form fields, trade list, search inputs, toast notifications, loading state

**Trade submission flow:** After a POST succeeds, the app waits 2 seconds before re-fetching by symbol to allow the Kafka consumer on the backend to process and persist the trade.

**Constants:** `EXCHANGES` and `SIDES` in `App.js:6-7` define the dropdown options for the trade form.
