const express = require('express');
const router = express.Router();
const aiEngine = require('../services/aiEngine');

// 1. Get Merchant AI Growth & Agentic Commerce Analytics
router.get('/insights', (req, res) => {
  try {
    const insights = aiEngine.getMerchantInsights();
    res.json({ success: true, insights });
  } catch (error) {
    console.error('Error fetching merchant insights:', error);
    res.status(500).json({ error: 'Failed to fetch merchant insights' });
  }
});

// 2. Catalog Readiness Audit
router.get('/catalog-audit', (req, res) => {
  try {
    const products = aiEngine.loadProducts();
    const auditResults = products.map(product => {
      const hasSemanticTags = !!(product.agenticMetadata && product.agenticMetadata.semanticKeywords && product.agenticMetadata.semanticKeywords.length >= 3);
      const hasStrengths = !!(product.strengths && Object.keys(product.strengths).length >= 3);
      const hasCrossSell = !!(product.crossSellIds && product.crossSellIds.length > 0) || product.category === 'accessory';
      const hasSpecs = !!(product.specs && Object.keys(product.specs).length >= 4);

      let score = 0;
      if (hasSemanticTags) score += 30;
      if (hasStrengths) score += 25;
      if (hasCrossSell) score += 20;
      if (hasSpecs) score += 25;

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        merchant: product.merchant,
        agenticScore: score,
        isAgentReady: score >= 85,
        missingFields: [
          !hasSemanticTags ? 'Semantic Keywords' : null,
          !hasStrengths ? 'Use-case Strengths' : null,
          !hasCrossSell ? 'Cross-sell Pairing' : null,
          !hasSpecs ? 'Structured Specs' : null
        ].filter(Boolean)
      };
    });

    res.json({
      success: true,
      totalProducts: auditResults.length,
      averageAgentScore: Math.round(auditResults.reduce((acc, cur) => acc + cur.agenticScore, 0) / auditResults.length),
      catalogAudit: auditResults
    });
  } catch (error) {
    console.error('Error auditing catalog:', error);
    res.status(500).json({ error: 'Failed to audit catalog' });
  }
});

module.exports = router;
