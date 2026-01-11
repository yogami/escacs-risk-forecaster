import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'vitest';
import { RiskForecastingService } from '../../src/lib/risk-forecaster/domain/services/RiskForecastingService';
import { MockWeatherAdapter, MockHistoryAdapter } from '../../src/lib/risk-forecaster/infrastructure/MockAdapters';
import { RiskForecast } from '../../src/lib/risk-forecaster/domain/entities/RiskForecast';

interface World {
    service: RiskForecastingService;
    weather: MockWeatherAdapter;
    history: MockHistoryAdapter;
    forecast?: RiskForecast;
}

Before(function (this: World) {
    this.weather = new MockWeatherAdapter();
    this.history = new MockHistoryAdapter();
    this.service = new RiskForecastingService(this.weather, this.history);
});

Given('a site {string} has a historical compliance rate of {int}%', async function (this: World, _siteId: string, rate: number) {
    this.history.setComplianceRate(rate / 100);
});

Given('the upcoming weather forecast predicts {float} inches of rain', async function (this: World, rain: number) {
    this.weather.setPrecipitation(rain);
});

When('I request a risk forecast for {string}', async function (this: World, siteId: string) {
    this.forecast = await this.service.computeForecast(siteId);
});

Then('the risk level should be {string}', async function (this: World, level: string) {
    expect(this.forecast?.level).toBe(level);
});

Then('the confidence score should be high', async function (this: World) {
    expect(this.forecast?.confidence).toBeGreaterThan(0.8);
});

Then('the risk score should be less than {int}', async function (this: World, score: number) {
    expect(this.forecast?.score).toBeLessThan(score);
});
