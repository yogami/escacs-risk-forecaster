import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3005';

test.describe('ESCACS Risk Forecaster E2E', () => {
    test('Health check returns 200', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/health`);
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.status).toBe('healthy');
        expect(body.service).toBe('risk-forecaster');
    });

    test('Risk Forecast Pipeline returns valid forecast', async ({ request }) => {
        // Test with real Fairfax, VA coordinates (real weather data in production)
        const response = await request.get(`${BASE_URL}/api/forecast/38.8462,-77.3064`);
        expect(response.ok()).toBeTruthy();
        const forecast = await response.json();

        // Verify forecast structure (actual values depend on real weather)
        expect(forecast.siteId).toBe('38.8462,-77.3064');
        expect(forecast.score).toBeGreaterThanOrEqual(0);
        expect(forecast.score).toBeLessThanOrEqual(100);
        expect(['Low', 'Moderate', 'High', 'Critical']).toContain(forecast.level);
        expect(forecast.confidence).toBeGreaterThan(0);
        expect(Array.isArray(forecast.factors)).toBeTruthy();
        expect(forecast.timestamp).toBeTruthy();
    });

    test('OpenAPI documentation is available', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/openapi.json`);
        expect(response.ok()).toBeTruthy();
        const spec = await response.json();
        expect(spec.info.title).toContain('Risk Forecaster');
    });
});
