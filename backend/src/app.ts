import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Route imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import researcherRoutes from './routes/researcher.routes';
import institutionRoutes from './routes/institution.routes';
import collaborationRoutes from './routes/collaboration.routes';
import publicationRoutes from './routes/publication.routes';
import reviewRoutes from './routes/review.routes';
import networkRoutes from './routes/network.routes';
import adminRoutes from './routes/admin.routes';
import dashboardRoutes from './routes/dashboard.routes';
import conferenceRoutes from './routes/conference.routes';
import citationRoutes from './routes/citation.routes';
import reportRoutes from './routes/report.routes';
import auditRoutes from './routes/audit.routes';
import systemRoutes from './routes/system.routes';

const app: Application = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(rateLimiter);

// ─── Request Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ───────────────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: env.NODE_ENV });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
const API = '/api/v1';

app.use(`${API}/auth`,            authRoutes);
app.use(`${API}/users`,           userRoutes);
app.use(`${API}/researchers`,     researcherRoutes);
app.use(`${API}/institutions`,    institutionRoutes);
app.use(`${API}/collaborations`,  collaborationRoutes);
app.use(`${API}/publications`,    publicationRoutes);
app.use(`${API}/reviews`,         reviewRoutes);
app.use(`${API}/network`,         networkRoutes);
app.use(`${API}/admin`,           adminRoutes);
app.use(`${API}/dashboard`,       dashboardRoutes);
app.use(`${API}/conferences`,     conferenceRoutes);
app.use(`${API}/citations`,       citationRoutes);
app.use(`${API}/reports`,         reportRoutes);
app.use(`${API}/audit-logs`,      auditRoutes);
app.use(`${API}/system`,          systemRoutes);

// ─── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
