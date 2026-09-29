# Project Plan

**Status**: Integrated
**Created**: 2026-09-30
**Mode**: AUGMENT

---

## 1. Project Overview

**Goal**: Improve the existing calculator workspace into a polished, independently testable browser calculator with a small Express API for stateless arithmetic evaluation.

**App Type**: SPA + API

**API Login**: No

**Mode**: AUGMENT

**Deployment Plan**: No deployment plan found

---

## 2. Backend — Calculator API

| Component | Technology |
|-----------|-----------|
| **Language** | JavaScript |
| **Runtime** | Node |
| **Package Manager** | npm |
| **Test Runner** | jest |
| **Mocking Library** | jest.mock |
| **Test Command** | npm test |
| **Orchestration** | docker-compose |

The Express API remains stateless. It validates a calculator expression, evaluates the supported arithmetic operation, and returns a structured result or the shared error response shape.

---

## 3. Frontend — Calculator Web App

| Component | Technology |
|-----------|-----------|
| **Language** | JavaScript |
| **Framework** | React + Vite |
| **Package Manager** | npm |
| **Test Runner** | jest |
| **Mocking Library** | jest.mock |
| **Test Command** | npm test |

The existing `public/` surface remains the browser entry point. The UI should make the current expression, operation controls, result, validation feedback, and keyboard-friendly interaction immediately legible on desktop and mobile.

---

## 4. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| Azure App Service | Host the Express API and serve the static calculator assets | — | `http://localhost:3000` | Essential |

No datastore is required. Calculations are transient and the API has no user accounts or persisted history.

---

## 5. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | backend | ✅ | 22.18.0 |
| npm | backend, frontend | ✅ | 10.9.3 |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Chrome | frontend | ✅ | 154.0.8037.58 |

Docker, Docker Compose, Azure Functions Core Tools, and the Azure Functions VS Code extension are not required because this plan has no Azure-emulated dependency and uses Express rather than Azure Functions.

---

## 6. Design System & UI

**Component Library**: Pico.css + native form controls
**Style Direction**: A focused calculation desk with a warm paper-like surface, deep ink typography, and electric teal actions. The primary interaction should feel calm and tactile, with a strong result readout and restrained elevation rather than a dashboard full of competing panels.
**Typography**: Segoe UI Variable, system-ui

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#087f8c` | Calculate action, active operation, and keyboard focus accents |
| `accent`  | `#f4a261` | Result highlight, equation emphasis, and secondary action accents |
| `surface` | `#f7f3ed` | Warm page and calculator workspace background |
| `text`    | `#172121` | Expressions, labels, and primary result text |
| `muted`   | `#66706f` | Hints, operation descriptions, and supporting metadata |
| `border`  | `#d9d1c5` | Calculator panel, input, and divider boundaries |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Calculator | `/` | Enter an arithmetic expression and see a validated result immediately. | `header, nav, main, split(form|card-list), footer` |

### Sample Content

Calculator — representative calculations:
| Expression | Result | State |
|------------|--------|-------|
| `128 + 64` | `192` | Ready |
| `9 × 7` | `63` | Ready |
| `450 ÷ 15` | `30` | Ready |
| `82 - 37` | `45` | Ready |

Calculator — form defaults: expression `128 + 64` · result `192` · status `Ready to calculate`

The preview depicts the populated state on the main screen, with a compact inline validation message and a visually reserved empty/error treatment available to the production UI when input is cleared or malformed.

---

## 7. Project Structure

```
Task 1 Calculator/
├── .azure/
│   └── project-plan.md
├── package.json
├── server.js
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── tests/
    ├── api.test.js
    └── calculator.test.js
```

---

## 8. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/api/health` | Report API availability for local and hosted checks | — | `{ status, services }` | 200, 503 |
| 2 | POST | `/api/calculate` | Validate and evaluate one arithmetic expression | `{ expression }` | `{ expression, result }` | 200, 422, 500 |
| 3 | GET | `/` | Serve the calculator web app | — | HTML document | 200, 404 |

All API failures use `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": null } }` or the corresponding shared error code.

---

## 9. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification
