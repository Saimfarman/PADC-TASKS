# Integration Plan

## Backend
- Folder: workspace root
- Run: `npm start`
- Port: `3000` (or `PORT`)
- Build/check: `node --check server.js`
- Health: `GET /api/health`

## Frontend
- Folder: `public/`
- Dev: `npm run dev`
- Build: not applicable; static assets served by Express
- API seam: `public/app.js` `fetch('/api/calculate')`
- Mock files to delete: none; no mock client or mock datasets exist

## API routes
- `GET /` serves `public/index.html`
- `GET /api/health` returns `{ status, services }`
- `GET /api/openapi.json` returns the API contract
- `POST /api/calculate` accepts `{ expression }` and returns `{ expression, result }`

## Database
- None. Calculations are transient.
- Migration tool/directory: none
- Connection environment variables: none
- Create NO seed data.

## Shared types
- None; JavaScript application with the API response shapes documented in `README.md` and `server.js`.

## Services
- Essential: Express API, static frontend hosting
- Enhancement: none

## Integration results
- Status: Integrated
- Migrations: Not applicable. The application has no SQL/PostgreSQL datastore; calculations are transient.
- Backend smoke test: `GET /`, `GET /api/health`, `GET /api/openapi.json`, and `POST /api/calculate` verified successfully.
- Frontend data source: `public/app.js` uses the live `/api/calculate` endpoint; the primary calculate action is wired to that handler. No mock client or mock dataset exists.
- End-to-end: Static frontend and Express backend were run together; browser submission of `9 * 7` returned and rendered `63` from the live API.