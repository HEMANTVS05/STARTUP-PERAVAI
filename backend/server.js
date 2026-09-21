// ─── PERAVAI — Express Backend ────────────────────────────────────────────────
// Architecture: React → Firebase Auth → ID Token → Express → Firebase Admin → Firestore
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { defaultLimiter } = require('./src/middleware/rateLimiter');
const { errorMiddleware } = require('./src/middleware/errorMiddleware');

const app = express();

// ─── SECURITY HEADERS ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman in dev)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' not allowed.`));
  },
  credentials: true,
}));

// ─── PARSERS ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false }));

// ─── GLOBAL RATE LIMIT ───────────────────────────────────────────────────────
app.use(defaultLimiter);

// ─── ROUTES ──────────────────────────────────────────────────────────────────
const userRoutes = require('./src/routes/userRoutes');
const registrationRoutes = require('./src/routes/registrationRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

app.use('/api/users', userRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payment', paymentRoutes);

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV })
);

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── START ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[PERAVAI backend] ▶  http://localhost:${PORT}  (${process.env.NODE_ENV || 'development'})`);
});
