// ─── PERAVAI — Express Backend ────────────────────────────────────────────────
// Architecture: React → Firebase Auth → ID Token → Express → Firebase Admin → Firestore
// Node.js runtime: >=20  (firebase-admin@13 uses jose@4 which is CJS-compatible)
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const { defaultLimiter } = require('./src/middleware/rateLimiter');
const { errorMiddleware } = require('./src/middleware/errorMiddleware');

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// Must be configured BEFORE helmet and route handlers so that OPTIONS
// preflight requests receive the correct headers even when the server is
// under helmet or auth restrictions.
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://startupperavai.in',
  'https://www.startupperavai.in',
  'https://startup-peravai-scanner.vercel.app',
];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : defaultOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (mobile apps, server-to-server, curl)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' not allowed.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// Apply CORS globally first — this handles OPTIONS preflight before any
// authentication middleware runs (authentication on OPTIONS causes 401 on preflight).
app.use(cors(corsOptions));



// ─── SECURITY HEADERS ────────────────────────────────────────────────────────
// Applied after CORS so that CORS headers are not overwritten by helmet.
app.use(helmet({
  // crossOriginResourcePolicy must not block CORS responses
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── PARSERS ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false }));

// ─── GLOBAL RATE LIMIT ───────────────────────────────────────────────────────
app.use(defaultLimiter);

// ─── ROUTES ──────────────────────────────────────────────────────────────────
const userRoutes         = require('./src/routes/userRoutes');
const registrationRoutes = require('./src/routes/registrationRoutes');
const teamRoutes         = require('./src/routes/teamRoutes');
const eventRoutes        = require('./src/routes/eventRoutes');
const paymentRoutes      = require('./src/routes/paymentRoutes');

app.use('/api/users',         userRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/teams',         teamRoutes);
app.use('/api/events',        eventRoutes);
app.use('/api/payment',       paymentRoutes);

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV || 'development' })
);

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── START ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
// On Vercel, the module is exported as a serverless function.
// On local dev, we start the HTTP server normally.
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`[PERAVAI backend] ▶  http://localhost:${PORT}  (${process.env.NODE_ENV || 'development'})`);
  });
}

// Export for Vercel Serverless Functions
module.exports = app;
