/**
 * ESCACS Risk Forecaster API Server
 */

import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { riskRoutes } from './routes/risk';
import process from 'node:process';

const app = new OpenAPIHono();

app.use('*', cors());

// Mount routes
app.route('/api/forecast', riskRoutes);

// Health check
app.get('/api/health', (c) => c.json({ status: 'healthy', service: 'risk-forecaster' }));

// OpenAPI doc
app.doc('/api/openapi.json', {
    openapi: '3.0.0',
    info: {
        title: 'ESCACS Risk Forecaster API',
        version: '1.0.0',
        description: 'Predictive historical risk analytics',
    },
    servers: [{ url: 'http://localhost:3005', description: 'Local' }],
});

app.get('/api/docs', swaggerUI({ url: '/api/openapi.json' }));

const port = parseInt(process.env.PORT || '8080', 10);
console.log(`Risk Forecaster running on port ${port}`);

serve({ fetch: app.fetch, port });

export default app;
