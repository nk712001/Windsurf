import client from 'prom-client';
import { Request, Response } from 'express';

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default metrics to the registry
client.collectDefaultMetrics({ register });

// Example of a custom counter
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

export function metricsHandler(req: Request, res: Response) {
  res.set('Content-Type', register.contentType);
  register.metrics().then(metrics => res.send(metrics));
}

export { register };
