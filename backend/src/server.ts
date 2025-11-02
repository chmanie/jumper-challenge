import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { addErrorToRequestLog, defaultErrorResponse, unexpectedRequest } from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(express.json());

// Request logging
app.use(requestLogger);

// API Routes
app.use('/api/health-check', healthCheckRouter);

// Swagger UI
app.use('/docs', openAPIRouter);

// Error handlers
app.use(addErrorToRequestLog);
app.use(defaultErrorResponse);
app.use(unexpectedRequest);

export { app, logger };
