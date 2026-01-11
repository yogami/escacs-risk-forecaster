/**
 * RiskForecastingService Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RiskForecastingService } from '../../../src/lib/risk-forecaster/domain/services/RiskForecastingService';
import { MockWeatherAdapter, MockHistoryAdapter } from '../../../src/lib/risk-forecaster/infrastructure/MockAdapters';

describe('RiskForecastingService', () => {
    let service: RiskForecastingService;
    let weather: MockWeatherAdapter;
    let history: MockHistoryAdapter;

    beforeEach(() => {
        weather = new MockWeatherAdapter();
        history = new MockHistoryAdapter();
        service = new RiskForecastingService(weather, history);
    });

    it('should compute a forecast with mixed factors', async () => {
        weather.setPrecipitation(2.5);
        history.setComplianceRate(0.5);

        const forecast = await service.computeForecast('site-1');

        expect(forecast.level).toBe('Critical');
        expect(forecast.factors).toContain('Severe precipitation forecast');
        expect(forecast.factors).toContain('Poor historical compliance records');
    });

    it('should compute low risk for perfect context', async () => {
        weather.setPrecipitation(0.1);
        history.setComplianceRate(1.0);

        const forecast = await service.computeForecast('site-2');

        expect(forecast.level).toBe('Low');
        expect(forecast.score).toBeLessThan(10);
        expect(forecast.factors).toContain('Stable site history and weather');
    });
});
