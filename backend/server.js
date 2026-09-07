const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Load Sub-Routers & Engine
const aiRoutes = require('./routes/aiRoutes');
const productRoutes = require('./routes/productRoutes');
const merchantRoutes = require('./routes/merchantRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const aiEngine = require('./services/aiEngine');

// Mount Routers
app.use('/api/ai', aiRoutes);
app.use('/api/products', productRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/payment', paymentRoutes);

// Direct Aliases for Buildathon Agentic Commerce API
app.post('/api/intent', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
  const intent = aiEngine.parseInitialIntent(prompt);
  res.json({ success: true, intent });
});

app.post('/api/questions', (req, res) => {
  const category = req.body?.category || req.query?.category || 'laptop';
  const questions = aiEngine.getCategoryQuestions(category);
  res.json({ success: true, category, questions });
});

// RFP Broadcast & Evaluated Offers (10 offers)
app.post('/api/rfp/broadcast', (req, res) => {
  try {
    const requirements = req.body.requirements || req.body;
    const rfpResults = aiEngine.broadcastRfpAndEvaluateOffers(requirements);
    res.json({ success: true, ...rfpResults });
  } catch (error) {
    console.error('Error broadcasting RFP:', error);
    res.status(500).json({ error: 'Failed to broadcast RFP' });
  }
});

// Bounded Negotiation Engine (Max 3 rounds)
app.post('/api/negotiate', (req, res) => {
  try {
    const { offerId, requirements } = req.body;
    const negotiationResult = aiEngine.runBoundedNegotiation(offerId, requirements);
    res.json({ success: true, ...negotiationResult });
  } catch (error) {
    console.error('Error running negotiation:', error);
    res.status(500).json({ error: 'Failed to run negotiation' });
  }
});

// Direct alias for follow-up
app.post('/api/follow-up', (req, res) => {
  try {
    const { productId, question, requirements } = req.body;
    if (!question) return res.status(400).json({ error: 'question is required' });
    const response = aiEngine.answerFollowUp(productId, question, requirements || {});
    res.json({ success: true, ...response });
  } catch (error) {
    console.error('Error answering follow-up:', error);
    res.status(500).json({ error: 'Failed to answer follow-up' });
  }
});

// Merchants Network & AI Commerce Passports
app.get('/api/merchants', (req, res) => {
  const merchants = aiEngine.loadMerchants();
  res.json({ success: true, count: merchants.length, merchants });
});

app.get('/api/merchants/:id/passport', (req, res) => {
  const merchants = aiEngine.loadMerchants();
  const merchant = merchants.find(m => m.id === req.params.id);
  if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
  res.json({ success: true, merchant, passport: merchant.passport });
});

// Merchant Analytics & Lost Intent Engine
app.get('/api/merchant-analytics', (req, res) => {
  const merchantId = req.query.merchantId || 'merch_technova';
  const analyticsData = aiEngine.getMerchantAnalyticsData(merchantId);
  res.json({ success: true, ...analyticsData });
});

// AI Growth Action Approval
app.post('/api/growth/approve', (req, res) => {
  const { merchantId, actionId } = req.body;

  aiEngine.recordAuditEvent({
    actor: 'MERCHANT AGENT',
    eventType: 'GROWTH_RULE_APPROVED',
    status: 'SUCCESS',
    description: `Merchant node ${merchantId || 'TechNova'} approved AI Growth Campaign rule: 3% dynamic concession deployed.`,
    payload: { merchantId, actionId, status: 'DEPLOYED_TO_A2A_ENGINE' }
  });

  res.json({
    success: true,
    merchantId,
    actionId,
    status: 'ACTIVE_SIMULATED',
    message: 'AI Growth Campaign Approved. Dynamic 3% concession rule deployed to A2A negotiation boundary.'
  });
});

// A2A Commerce Audit Trail
app.get('/api/audit-trail', (req, res) => {
  const logs = aiEngine.loadAuditLogs();
  const { actor } = req.query;
  let filtered = logs;
  if (actor && actor !== 'ALL') {
    filtered = logs.filter(l => l.actor.toUpperCase() === actor.toUpperCase());
  }
  res.json({ success: true, count: filtered.length, auditLogs: filtered, logs: filtered });
});

app.post('/api/audit-trail', (req, res) => {
  const event = req.body;
  const newLog = aiEngine.recordAuditEvent(event);
  res.json({ success: true, event: newLog });
});

// Explainability Layer ("Why did NEXA do this?")
app.post('/api/why-nexa', (req, res) => {
  const { decisionType, context } = req.body;
  const explanation = aiEngine.getWhyNexaExplanation(decisionType, context);
  res.json({ success: true, explanation });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NEXA A2A Commerce & AI Growth Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 NEXA A2A Agentic Commerce Backend running on port ${PORT}`);
  console.log(`👉 Health: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
