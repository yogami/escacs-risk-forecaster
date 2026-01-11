/**
 * Risk Forecaster API Routes
 */

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { RiskForecastingService, IWeatherPort } from '../../lib/risk-forecaster/domain/services/RiskForecastingService';
import { MockWeatherAdapter, MockHistoryAdapter } from '../../lib/risk-forecaster/infrastructure/MockAdapters';
import { TomorrowIOAdapter } from '../../lib/risk-forecaster/infrastructure/TomorrowIOAdapter';
import process from 'node:process';

export const riskRoutes = new OpenAPIHono();

// Use Tomorrow.io if API key is available, otherwise fall back to mock
function createWeatherAdapter(): IWeatherPort {
    if (process.env.TOMORROW_IO_API_KEY) {
        console.log('Using Tomorrow.io Weather Adapter (Production)');
        return new TomorrowIOAdapter();
    }
    console.log('Using Mock Weather Adapter (Development)');
    return new MockWeatherAdapter();
}

// Persistence/DI
const weatherAdapter = createWeatherAdapter();
const historyAdapter = new MockHistoryAdapter();
const service = new RiskForecastingService(weatherAdapter, historyAdapter);

const ForecastSchema = z.object({
    siteId: z.string(),
    score: z.number(),
    level: z.string(),
    confidence: z.number(),
    factors: z.array(z.string()),
    timestamp: z.string()
});

riskRoutes.openapi(
    createRoute({
        method: 'get',
        path: '/{siteId}',
        summary: 'Get site risk forecast',
        request: {
            params: z.object({ siteId: z.string() }),
            query: z.object({
                mockRain: z.string().optional(),
                mockHistory: z.string().optional()
            })
        },
        responses: {
            200: {
                description: 'Risk forecast retrieved',
                content: { 'application/json': { schema: ForecastSchema } }
            }
        }
    }),
    async (c) => {
        const { siteId } = c.req.valid('param');
        const { mockRain, mockHistory } = c.req.valid('query');

        // Testability: Allow overriding mocks via query params for demo/testing
        // This only works with the mock adapters, not production adapters
        if (mockRain && 'setPrecipitation' in weatherAdapter) {
            (weatherAdapter as MockWeatherAdapter).setPrecipitation(parseFloat(mockRain));
        }
        if (mockHistory) historyAdapter.setComplianceRate(parseFloat(mockHistory));

        const forecast = await service.computeForecast(siteId);
        return c.json({
            ...forecast,
            timestamp: forecast.timestamp.toISOString()
        });
    }
);
