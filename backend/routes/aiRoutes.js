const express = require('express');
const router = express.Router();
const aiEngine = require('../services/aiEngine');

// 1. POST /api/intent & /api/ai/parse-intent
const handleIntent = (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const intent = aiEngine.parseInitialIntent(prompt);
    res.json({ success: true, intent });
  } catch (error) {
    console.error('Error parsing intent:', error);
    res.status(500).json({ error: 'Failed to parse intent' });
  }
};
router.post('/parse-intent', handleIntent);
router.post('/intent', handleIntent);

// 2. GET/POST /api/questions
const handleQuestions = (req, res) => {
  try {
    const category = req.query.category || req.body?.category || 'laptop';
    const questions = aiEngine.getCategoryQuestions(category);
    res.json({ success: true, category, questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};
router.get('/questions', handleQuestions);
router.post('/questions', handleQuestions);

// 3. POST /api/answer
router.post('/answer', (req, res) => {
  try {
    const { currentRequirements = {}, field, value, step = 0 } = req.body;
    const updated = { ...currentRequirements, [field]: value };
    const questions = aiEngine.getCategoryQuestions(updated.category || 'laptop');
    const isComplete = step >= questions.length - 1;

    let recommendations = null;
    if (isComplete) {
      recommendations = aiEngine.matchProducts(updated);
    }

    res.json({
      success: true,
      updatedRequirements: updated,
      isComplete,
      nextStep: isComplete ? null : step + 1,
      recommendations
    });
  } catch (error) {
    console.error('Error processing answer:', error);
    res.status(500).json({ error: 'Failed to process answer' });
  }
});

// 4. POST /api/recommendations & /api/recommendations/update & /api/ai/match
const handleMatch = (req, res) => {
  try {
    const requirements = req.body.requirements || req.body;
    if (!requirements) {
      return res.status(400).json({ error: 'Requirements object is required' });
    }
    const matches = aiEngine.matchProducts(requirements);
    res.json({
      success: true,
      count: matches.length,
      requirements,
      recommendations: matches
    });
  } catch (error) {
    console.error('Error matching products:', error);
    res.status(500).json({ error: 'Failed to match products' });
  }
};
router.post('/match', handleMatch);
router.post('/recommendations', handleMatch);
router.post('/recommendations/update', handleMatch);

// 5. POST /api/ai/explain
router.post('/explain', (req, res) => {
  try {
    const { productId, requirements } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    const explanation = aiEngine.explainProduct(productId, requirements || {});
    res.json({ success: true, explanation });
  } catch (error) {
    console.error('Error generating explainability:', error);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// 6. POST /api/follow-up
router.post('/follow-up', (req, res) => {
  try {
    const { productId, question, requirements } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }
    const response = aiEngine.answerFollowUp(productId, question, requirements || {});
    res.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in follow-up question:', error);
    res.status(500).json({ error: 'Failed to process follow-up' });
  }
});

// 7. POST /api/cart (Constraint checking)
router.post('/cart', (req, res) => {
  try {
    const { budget = 70000, primaryProduct, addons = [] } = req.body;
    if (!primaryProduct) {
      return res.status(400).json({ error: 'primaryProduct is required' });
    }
    const constraintResult = aiEngine.checkBudgetConstraints(budget, primaryProduct, addons);
    res.json({ success: true, constraintResult });
  } catch (error) {
    console.error('Error checking cart constraints:', error);
    res.status(500).json({ error: 'Failed to check cart constraints' });
  }
});

// 8. GET & POST /api/cross-sell
router.get('/cross-sell/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    const bundles = aiEngine.getCrossSellBundles(productId, req.query);
    res.json({ success: true, productId, bundles });
  } catch (error) {
    console.error('Error fetching cross-sells:', error);
    res.status(500).json({ error: 'Failed to fetch cross-sell bundles' });
  }
});
router.post('/cross-sell', (req, res) => {
  try {
    const { productId } = req.body;
    const bundles = aiEngine.getCrossSellBundles(productId, req.body);
    res.json({ success: true, productId, bundles });
  } catch (error) {
    console.error('Error fetching cross-sells:', error);
    res.status(500).json({ error: 'Failed to fetch cross-sell bundles' });
  }
});

// 9. GET /api/activity-log
router.get('/activity-log', (req, res) => {
  res.json({
    success: true,
    steps: [
      { id: '1', title: 'Customer intent received', icon: 'check', status: 'completed' },
      { id: '2', title: 'Requirements extracted', icon: 'check', status: 'completed' },
      { id: '3', title: 'Relevant questions selected', icon: 'check', status: 'completed' },
      { id: '4', title: 'Products matched', icon: 'check', status: 'completed' },
      { id: '5', title: 'Recommendation generated', icon: 'check', status: 'completed' },
      { id: '6', title: 'Cross-sell suggestion generated', icon: 'check', status: 'completed' },
      { id: '7', title: 'Customer approved order', icon: 'check', status: 'completed' },
      { id: '8', title: 'Razorpay checkout initiated', icon: 'check', status: 'completed' }
    ]
  });
});

module.exports = router;
