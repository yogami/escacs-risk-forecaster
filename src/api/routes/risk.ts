/**
 * Risk Forecaster API Routes
 */

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { RiskForecastingService } from '../../lib/risk-forecaster/domain/services/RiskForecastingService';
import { MockWeatherAdapter, MockHistoryAdapter } from '../../lib/risk-forecaster/infrastructure/MockAdapters';

export const riskRoutes = new OpenAPIHono();

// Persistence/DI (In-memory mocks for now)
const weatherAdapter = new MockWeatherAdapter();
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
        if (mockRain) weatherAdapter.setPrecipitation(parseFloat(mockRain));
        if (mockHistory) historyAdapter.setComplianceRate(parseFloat(mockHistory));

        const forecast = await service.computeForecast(siteId);
        return c.json({
            ...forecast,
            timestamp: forecast.timestamp.toISOString()
        });
    }
);
