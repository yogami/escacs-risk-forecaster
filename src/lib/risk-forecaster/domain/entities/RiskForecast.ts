/**
 * RiskForecast - Domain Entity
 */

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskForecastProps {
    siteId: string;
    score: number; // 0-100
    level: RiskLevel;
    confidence: number; // 0-1
    factors: string[];
    timestamp: Date;
}

export class RiskForecast {
    readonly siteId: string;
    readonly score: number;
    readonly level: RiskLevel;
    readonly confidence: number;
    readonly factors: string[];
    readonly timestamp: Date;

    constructor(props: RiskForecastProps) {
        this.siteId = props.siteId;
        this.score = props.score;
        this.level = props.level;
        this.confidence = props.confidence;
        this.factors = props.factors;
        this.timestamp = props.timestamp;
    }

    static calculateLevel(score: number): RiskLevel {
        if (score >= 80) return 'Critical';
        if (score >= 50) return 'High';
        if (score >= 20) return 'Medium';
        return 'Low';
    }

    static create(props: Omit<RiskForecastProps, 'timestamp' | 'level'>): RiskForecast {
        return new RiskForecast({
            ...props,
            level: this.calculateLevel(props.score),
            timestamp: new Date()
        });
    }
}
