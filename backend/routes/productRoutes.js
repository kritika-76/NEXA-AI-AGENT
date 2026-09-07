const express = require('express');
const router = express.Router();
const aiEngine = require('../services/aiEngine');

// 1. Get all products (with optional category filter)
router.get('/', (req, res) => {
  try {
    const products = aiEngine.loadProducts();
    const { category, search } = req.query;
    
    let filtered = products;
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.merchant.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.agenticMetadata && p.agenticMetadata.semanticKeywords && p.agenticMetadata.semanticKeywords.some(k => k.toLowerCase().includes(q)))
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      products: filtered
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 2. Get product by ID
router.get('/:id', (req, res) => {
  try {
    const products = aiEngine.loadProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
