/**
 * Mock Adapters for Risk Forecaster
 */

import { IWeatherPort, IHistoryPort } from '../domain/services/RiskForecastingService';

export class MockWeatherAdapter implements IWeatherPort {
    private mockPrecipitation = 0.5;

    setPrecipitation(inches: number) {
        this.mockPrecipitation = inches;
    }

    async getForecast(_siteId: string): Promise<{ precipitationInches: number }> {
        return { precipitationInches: this.mockPrecipitation };
    }
}

export class MockHistoryAdapter implements IHistoryPort {
    private mockRate = 0.9;

    setComplianceRate(rate: number) {
        this.mockRate = rate;
    }

    async getComplianceRate(_siteId: string): Promise<number> {
        return this.mockRate;
    }
}
