<<<<<<< HEAD
# Calculation Desk

A small full-stack calculator built for PADC Task 1. It uses a warm, responsive browser interface and a Node.js/Express backend that validates and evaluates arithmetic expressions without `eval`.

## Features

- Responsive calculation-desk UI with keypad and keyboard support.
- Arithmetic operations: `+`, `-`, `*`, `/`, `%`, decimals, parentheses, and unary negative values.
- Backend validation, divide-by-zero handling, and finite-number checks.
- Health endpoint for a quick service check.
- No database, authentication, or external runtime service required.

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000 in a browser. For automatic server restarts while editing, use `npm run dev`.

## API

### `GET /api/health`

Returns the service status:

```json
{"status":"healthy","services":{"api":{"status":"healthy"}}}
```

### `POST /api/calculate`

Request body:

```json
{"expression":"(12 + 8) / 4"}
```

Successful response:

```json
{"expression":"(12 + 8) / 4","result":5,"executionTimeMs":0.39}
```

## Project structure

| Path | Responsibility |
| --- | --- |
| `server.js` | Express server, static hosting, parser, and API routes |
| `public/index.html` | Calculator page structure |
| `public/styles.css` | Responsive glassmorphism visual design |
| `public/app.js` | Button/keyboard interaction and API calls |
| `package.json` | Scripts and dependency metadata |
| `tests/` | Jest and Supertest API/evaluator coverage |

## Execution time and performance

- The result card displays `Execution time: X ms` after each successful calculation.
- `executionTimeMs` in the `POST /api/calculate` response is measured on the backend with `performance.now()` around the expression evaluator.
- This value measures parsing and arithmetic evaluation only. It excludes browser rendering, HTTP request/response time, and npm startup time.
- For the full browser round-trip, use the browser developer tools Network panel and inspect the `POST /api/calculate` request.
- The first `npm install` is the slowest step because npm downloads Express and its dependencies; later starts reuse the local install.

### Per-request timing

There is no single fixed execution time. Every successful `POST /api/calculate` request measures its own parser and arithmetic duration and returns a new `executionTimeMs` value. It can vary with expression length, machine load, and runtime state.

Example result shown in the frontend:

```text
Execution time: 1.539 ms
```

To print the backend execution time for five individual requests in PowerShell:

```powershell
1..5 | ForEach-Object {
	$response = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/calculate" -ContentType "application/json" -Body '{"expression":"12 + 8 * 2"}'
	"Request $($_): $($response.executionTimeMs) ms"
}
```

The displayed value is the time taken by the calculation itself. The browser Network panel shows the larger end-to-end request time when network and rendering time are included.

These are local development expectations, not a production SLA. Actual times depend on Node.js version, disk speed, machine load, and network conditions during installation.

## Verification

After starting the server, run:

```bash
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/calculate -H "Content-Type: application/json" -d "{\"expression\":\"12 + 8 * 2\"}"
```

The second request should return a result of `28`, confirming operator precedence and API connectivity.
=======
# PADC-TASKS
TASK 1
>>>>>>> e702385526f026d1a9f32e575a2ffe57f13d70ca
