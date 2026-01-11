# ESCACS Historical Risk Forecaster

## Objective
Implement a predictive engine that forecasts compliance risk scores for construction sites by analyzing the intersection of upcoming weather events and historical site behavior.

---

## Task Breakdown

### 1. Project Scaffolding
- [x] Create project structure
- [x] Initialize `package.json`
- [x] Link Berlin AI Studio rules via `install-brain.sh`
- [x] Set up `tsconfig.json` and `vite.config.ts`
- [x] Create `tests/setup.ts`

### 2. Acceptance Tests (ATDD)
- [ ] Write `risk-forecasting.feature`
- [ ] Create step definitions

### 3. Domain Implementation
- [ ] Entities: `SiteHistory`, `WeatherThreat`, `RiskForecast`
- [ ] Services: `RiskForecastingService`
- [ ] Ports: `IHistoryPort`, `IWeatherPort`

### 4. Infrastructure Implementation
- [ ] `MockHistoryAdapter`
- [ ] `MockWeatherAdapter`
- [ ] `LinearEnsembleForecaster` (Simple weighted logic)

### 5. API Layer
- [ ] `GET /api/forecast/:siteId`
- [ ] `GET /api/health`

### 6. Gold Standards Compliance
- [ ] Cyclomatic Complexity ≤ 3 per function
- [ ] Unit Test Coverage ≥ 80%
- [ ] 100% Acceptance Test Pass Rate

### 7. Registration & Deployment
- [ ] Register in `Microservices_Catalog.md`
- [ ] Register with Capability Broker
- [ ] Deploy to Railway
