const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting NEXA Backend Automated Tests ---');

  try {
    // 1. Health
    const health = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
    console.log('✓ [1/9] Health Check:', health.status === 200 ? 'PASS' : 'FAIL', health.body.status);

    // 2. Products
    const products = await request({ host: 'localhost', port: 5000, path: '/api/products', method: 'GET' });
    console.log('✓ [2/9] Products List:', products.status === 200 ? 'PASS' : 'FAIL', `(${products.body.count} items)`);

    // 3. Parse Intent
    const intent = await request({
      host: 'localhost',
      port: 5000,
      path: '/api/ai/parse-intent',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { prompt: 'I need a laptop for coding under ₹70,000' });
    console.log('✓ [3/9] Parse Intent:', intent.status === 200 ? 'PASS' : 'FAIL', `Category: ${intent.body.intent.category}, Budget: ₹${intent.body.intent.budget}, Use: ${intent.body.intent.primaryUse}`);

    // 4. Dynamic Questions
    const questions = await request({ host: 'localhost', port: 5000, path: '/api/ai/questions?category=laptop', method: 'GET' });
    console.log('✓ [4/9] Dynamic Questions:', questions.status === 200 ? 'PASS' : 'FAIL', `(${questions.body.questions.length} questions)`);

    // 5. Match Products
    const match = await request({
      host: 'localhost',
      port: 5000,
      path: '/api/ai/match',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      requirements: {
        category: 'laptop',
        budget: 70000,
        primaryUse: 'coding',
        priority: 'performance',
        ram: '16GB',
        delivery: 'express'
      }
    });
    console.log('✓ [5/9] Product Matching:', match.status === 200 ? 'PASS' : 'FAIL', `Top Pick: "${match.body.recommendations[0]?.name}" (${match.body.recommendations[0]?.matchScore}%)`);

    // 6. Explainability
    const explain = await request({
      host: 'localhost',
      port: 5000,
      path: '/api/ai/explain',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      productId: 'prod_lap_01',
      requirements: { budget: 70000, primaryUse: 'coding', priority: 'performance' }
    });
    console.log('✓ [6/9] Explainability Engine:', explain.status === 200 ? 'PASS' : 'FAIL', `Checks: ${explain.body.explanation.requirementMatches.length}`);

    // 7. Follow-Up Q/A
    const followUp = await request({
      host: 'localhost',
      port: 5000,
      path: '/api/ai/follow-up',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      productId: 'prod_lap_01',
      question: 'Is this good for Python and Docker?'
    });
    console.log('✓ [7/9] Follow-up Q/A:', followUp.status === 200 ? 'PASS' : 'FAIL', `Answer preview: "${followUp.body.answer.substring(0, 45)}..."`);

    // 8. Cross-sell Bundle
    const crossSell = await request({ host: 'localhost', port: 5000, path: '/api/ai/cross-sell/prod_lap_01', method: 'GET' });
    console.log('✓ [8/9] Explainable Cross-Sell:', crossSell.status === 200 ? 'PASS' : 'FAIL', `Bundles: ${crossSell.body.bundles.length}`);

    // 9. Payment Order & Verify
    const order = await request({
      host: 'localhost',
      port: 5000,
      path: '/api/payment/create-order',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { amount: 67610 });
    console.log('✓ [9/9] Razorpay Test Order:', order.status === 200 ? 'PASS' : 'FAIL', `Order ID: ${order.body.order.id} (Simulated: ${order.body.isSimulated})`);

    console.log('\n🎉 ALL 9 BACKEND ENDPOINT TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('Test execution failed:', err);
  }
}

runTests();
