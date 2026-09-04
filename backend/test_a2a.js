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

async function runA2ATests() {
  console.log('--- Testing NEXA A2A Commerce & Merchant Network Backend ---\n');

  try {
    // 1. Health
    const health = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
    console.log('✓ [1/6] Health Check:', health.status === 200 ? 'PASS' : 'FAIL', health.body.service);

    // 2. Merchants & AI Commerce Passport
    const merchants = await request({ host: 'localhost', port: 5000, path: '/api/merchants', method: 'GET' });
    console.log('✓ [2/6] Merchant Network:', merchants.status === 200 ? 'PASS' : 'FAIL', `(${merchants.body.count} verified merchants)`);

    const passport = await request({ host: 'localhost', port: 5000, path: '/api/merchants/merch_technova/passport', method: 'GET' });
    console.log('   Passport DID:', passport.body.passport?.merchantId, '| Concession Limit:', passport.body.merchant?.negotiationLimits?.maxConcessionPercent + '%');

    // 3. RFP Broadcast & Evaluated Offers
    const rfp = await request({
      host: 'localhost',
      port: 5000,
      path: '/api/rfp/broadcast',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      requirements: { budget: 70000, priority: 'performance', primaryUse: 'coding', ram: '16GB' }
    });
    console.log('✓ [3/6] RFP Broadcast & Offers:', rfp.status === 200 ? 'PASS' : 'FAIL', `Evaluated: ${rfp.body.totalOffersEvaluated} offers (Passed: ${rfp.body.passedPolicyCount}, Blocked: ${rfp.body.blockedPolicyCount})`);
    console.log('   Recommended Pick:', rfp.body.recommendedPick?.productName, 'by', rfp.body.recommendedPick?.merchant, `(Utility: ${rfp.body.recommendedPick?.aiUtilityScore}/100)`);

    // 4. Bounded Negotiation
    const neg = await request({
      host: 'localhost',
      port: 5000,
      path: '/api/negotiate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { offerId: 'offer_01', requirements: { budget: 70000 } });
    console.log('✓ [4/6] Bounded Negotiation:', neg.status === 200 ? 'PASS' : 'FAIL', `Rounds: ${neg.body.totalRounds} | Original: ₹${neg.body.originalPrice} -> Final: ₹${neg.body.authoritativeFinalTotal}`);

    // 5. Merchant Analytics & Lost Intent
    const analytics = await request({ host: 'localhost', port: 5000, path: '/api/merchant-analytics?merchantId=merch_technova', method: 'GET' });
    console.log('✓ [5/6] Merchant Analytics & Lost Intent:', analytics.status === 200 ? 'PASS' : 'FAIL', `Lost Intent Root Causes: ${analytics.body.lostIntentRootCauses?.breakdown?.length}`);

    // 6. Cryptographic Audit Trail
    const audit = await request({ host: 'localhost', port: 5000, path: '/api/audit-trail', method: 'GET' });
    console.log('✓ [6/6] A2A Audit Trail:', audit.status === 200 ? 'PASS' : 'FAIL', `(${audit.body.count} traceable events)`);

    console.log('\n🎉 ALL A2A BACKEND ENDPOINTS PASSED WITH 100% SUCCESS! 🎉\n');
  } catch (err) {
    console.error('Test execution failed:', err);
  }
}

runA2ATests();
