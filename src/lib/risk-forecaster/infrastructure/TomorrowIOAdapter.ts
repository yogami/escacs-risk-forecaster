/**
 * TomorrowIOAdapter - Production weather adapter using Tomorrow.io API
 */

import { IWeatherPort } from '../domain/services/RiskForecastingService';

const TOMORROW_IO_BASE = 'https://api.tomorrow.io/v4/timelines';

export class TomorrowIOAdapter implements IWeatherPort {
    private readonly apiKey: string;

    constructor() {
        const key = process.env.TOMORROW_IO_API_KEY;
        if (!key) {
            throw new Error('TOMORROW_IO_API_KEY environment variable is required');
        }
        this.apiKey = key;
    }

    async getForecast(siteId: string): Promise<{ precipitationInches: number }> {
        // Parse site coordinates from siteId format: "lat,lon" or use default
        const [lat, lon] = this.parseCoordinates(siteId);

        const url = new URL(TOMORROW_IO_BASE);
        url.searchParams.set('location', `${lat},${lon}`);
        url.searchParams.set('fields', 'precipitationIntensity');
        url.searchParams.set('timesteps', '1d');
        url.searchParams.set('units', 'imperial');
        url.searchParams.set('apikey', this.apiKey);

        const response = await fetch(url.toString());
        if (!response.ok) {
            console.error('Tomorrow.io API error:', response.status);
            return { precipitationInches: 0 };
        }

        const data = await response.json() as TomorrowIOResponse;
        return this.extractPrecipitation(data);
    }

    private parseCoordinates(siteId: string): [number, number] {
        const parts = siteId.split(',');
        if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lon = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lon)) {
                return [lat, lon];
            }
        }
        // Default: Fairfax, Virginia
        return [38.8462, -77.3064];
    }

    private extractPrecipitation(data: TomorrowIOResponse): { precipitationInches: number } {
        const intervals = data?.data?.timelines?.[0]?.intervals;
        if (!intervals || intervals.length === 0) {
            return { precipitationInches: 0 };
        }

        // Sum precipitation over next 24 hours
        const total = intervals.slice(0, 1).reduce((sum, interval) => {
            return sum + (interval.values?.precipitationIntensity || 0);
        }, 0);

        return { precipitationInches: total };
    }
}

interface TomorrowIOResponse {
    data?: {
        timelines?: Array<{
            intervals?: Array<{
                values?: {
                    precipitationIntensity?: number;
                };
            }>;
        }>;
    };
}
