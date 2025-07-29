import expressWinston from 'express-winston';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

// Trace ID middleware
export function traceId(req: Request, res: Response, next: NextFunction) {
  req.headers['x-trace-id'] = req.headers['x-trace-id'] || uuidv4();
  res.setHeader('x-trace-id', req.headers['x-trace-id']);
  next();
}

export const logger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: false,
  colorize: false,
  dynamicMeta: (req, res) => ({ traceId: req.headers['x-trace-id'] }),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
});
