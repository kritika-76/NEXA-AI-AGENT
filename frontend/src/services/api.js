import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export const aiService = {
  // Parse initial intent
  parseIntent: async (prompt) => {
    const res = await api.post('/intent', { prompt });
    return res.data;
  },

  // Get dynamic questions
  getQuestions: async (category = 'laptop') => {
    const res = await api.post('/questions', { category });
    return res.data;
  },

  // Broadcast RFP to Merchant Network & Evaluate 10 Offers
  broadcastRfp: async (requirements) => {
    const res = await api.post('/rfp/broadcast', { requirements });
    return res.data;
  },

  // Run Bounded Negotiation (Max 3 rounds)
  runNegotiation: async (offerId, requirements) => {
    const res = await api.post('/negotiate', { offerId, requirements });
    return res.data;
  },

  // Match products (backward compatibility)
  matchProducts: async (requirements) => {
    const res = await api.post('/recommendations', { requirements });
    return res.data;
  },

  // Explain recommendation / Decision
  explainProduct: async (productId, requirements) => {
    const res = await api.post('/ai/explain', { productId, requirements });
    return res.data;
  },

  getWhyNexa: async (decisionType, context) => {
    const res = await api.post('/why-nexa', { decisionType, context });
    return res.data;
  },

  // Ask product follow-up question
  askFollowUp: async (productId, question, requirements) => {
    const res = await api.post('/follow-up', { productId, question, requirements });
    return res.data;
  },

  // Get cross-sell bundles
  getCrossSell: async (productId) => {
    const res = await api.get(`/ai/cross-sell/${productId}`);
    return res.data;
  },

  // Alias for cross-sell
  getCrossSellBundles: async (productId) => {
    const res = await api.get(`/ai/cross-sell/${productId}`);
    return res.data;
  }
};

export const merchantService = {
  // Get all 5 connected merchants
  getMerchants: async () => {
    const res = await api.get('/merchants');
    return res.data;
  },

  // Get merchant AI Commerce Passport
  getMerchantPassport: async (merchantId) => {
    const res = await api.get(`/merchants/${merchantId}/passport`);
    return res.data;
  },

  // Get merchant analytics & lost intent data
  getMerchantAnalytics: async (merchantId = 'merch_technova') => {
    const res = await api.get(`/merchant-analytics?merchantId=${encodeURIComponent(merchantId)}`);
    return res.data;
  },

  // Approve AI Growth Campaign action
  approveGrowthAction: async (data) => {
    const res = await api.post('/growth/approve', data);
    return res.data;
  }
};

export const auditService = {
  // Get A2A audit logs with actor filter
  getAuditLogs: async (actor = 'ALL') => {
    const res = await api.get(`/audit-trail?actor=${encodeURIComponent(actor)}`);
    return res.data;
  },

  // Push new audit event
  logEvent: async (event) => {
    const res = await api.post('/audit-trail', event);
    return res.data;
  }
};

export const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  }
};

export const paymentService = {
  createOrder: async (data) => {
    const res = await api.post('/payment/create-order', data);
    return res.data;
  },
  verifyPayment: async (data) => {
    const res = await api.post('/payment/verify', data);
    return res.data;
  }
};

export default api;
