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

    test('Risk Forecast Pipeline', async ({ request }) => {
        // High Risk Site
        const response = await request.get(`${BASE_URL}/api/forecast/site-alpha`, {
            params: {
                mockRain: '3.0',
                mockHistory: '0.4'
            }
        });
        expect(response.ok()).toBeTruthy();
        const forecast = await response.json();
        expect(forecast.level).toBe('Critical');
        expect(forecast.factors).toContain('Severe precipitation forecast');
        expect(forecast.factors).toContain('Poor historical compliance records');

        // Low Risk Site
        const lowResponse = await request.get(`${BASE_URL}/api/forecast/site-beta`, {
            params: {
                mockRain: '0.1',
                mockHistory: '1.0'
            }
        });
        expect(lowResponse.ok()).toBeTruthy();
        const lowForecast = await lowResponse.json();
        expect(lowForecast.level).toBe('Low');
    });

    test('OpenAPI documentation is available', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/openapi.json`);
        expect(response.ok()).toBeTruthy();
        const spec = await response.json();
        expect(spec.info.title).toContain('Risk Forecaster');
    });
});
