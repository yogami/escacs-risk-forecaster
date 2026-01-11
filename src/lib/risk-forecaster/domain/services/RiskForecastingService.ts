/**
 * RiskForecastingService - Domain Service
 */

import { RiskForecast } from '../entities/RiskForecast';

export interface IWeatherPort {
    getForecast(siteId: string): Promise<{ precipitationInches: number }>;
}

export interface IHistoryPort {
    getComplianceRate(siteId: string): Promise<number>; // 0-1
}

export class RiskForecastingService {
    constructor(
        private readonly weatherPort: IWeatherPort,
        private readonly historyPort: IHistoryPort
    ) { }

    async computeForecast(siteId: string): Promise<RiskForecast> {
        const [weather, history] = await Promise.all([
            this.weatherPort.getForecast(siteId),
            this.historyPort.getComplianceRate(siteId)
        ]);

        const score = this.calculateWeightedScore(weather.precipitationInches, history);
        const factors = this.identifyRiskFactors(weather.precipitationInches, history);

        return RiskForecast.create({
            siteId,
            score,
            confidence: 0.85, // Meta-weighted confidence
            factors
        });
    }

    private calculateWeightedScore(rain: number, compliance: number): number {
        // Weighted average: rain impact (0.7) + history impact (0.3)
        const rainScore = Math.min(100, rain * 40); // 1 inch = 40 points
        const historyRisk = (1 - compliance) * 100;

        const finalScore = (rainScore * 0.7) + (historyRisk * 0.3);
        return Math.min(100, Math.round(finalScore));
    }

    private identifyRiskFactors(rain: number, compliance: number): string[] {
        const factors: string[] = [];
        if (rain > 1) factors.push('Severe precipitation forecast');
        if (compliance < 0.7) factors.push('Poor historical compliance records');
        if (factors.length === 0) factors.push('Stable site history and weather');
        return factors;
    }
}
