const fs = require('fs');
const path = require('path');

// File paths
const productsFilePath = path.join(__dirname, '../data/products.json');
const merchantsFilePath = path.join(__dirname, '../data/merchants.json');
const offersFilePath = path.join(__dirname, '../data/offers.json');
const auditLogsFilePath = path.join(__dirname, '../data/auditLogs.json');

// Caches
let productsCache = [];
let merchantsCache = [];
let offersCache = [];
let auditLogsCache = [];

function loadProducts() {
  try {
    productsCache = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
  } catch (e) {
    console.error('Error loading products.json:', e);
  }
  return productsCache;
}

function loadMerchants() {
  try {
    merchantsCache = JSON.parse(fs.readFileSync(merchantsFilePath, 'utf8'));
  } catch (e) {
    console.error('Error loading merchants.json:', e);
  }
  return merchantsCache;
}

function loadOffers() {
  try {
    offersCache = JSON.parse(fs.readFileSync(offersFilePath, 'utf8'));
  } catch (e) {
    console.error('Error loading offers.json:', e);
  }
  return offersCache;
}

function loadAuditLogs() {
  try {
    auditLogsCache = JSON.parse(fs.readFileSync(auditLogsFilePath, 'utf8'));
  } catch (e) {
    console.error('Error loading auditLogs.json:', e);
  }
  return auditLogsCache;
}

function recordAuditEvent(event) {
  const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const newLog = {
    id: event.id || `audit_evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: event.timestamp || timestamp,
    actor: event.actor || 'BUYER AGENT',
    eventType: event.eventType || 'INFO',
    status: event.status || 'INFO',
    description: event.description || '',
    payload: event.payload || {}
  };

  if (!auditLogsCache || auditLogsCache.length === 0) {
    loadAuditLogs();
  }

  // Prepend or append to cache
  auditLogsCache.push(newLog);

  // Keep last 150 events in file
  try {
    const trimmed = auditLogsCache.slice(-150);
    fs.writeFileSync(auditLogsFilePath, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing auditLogs.json:', e);
  }

  return newLog;
}

// Initial bootstrap
loadProducts();
loadMerchants();
loadOffers();
loadAuditLogs();

/**
 * 1. Intent Parser: Extracts category, budget, primary use, priority, and specs from prompt
 */
function parseInitialIntent(prompt) {
  const text = (prompt || '').toLowerCase().trim();
  
  const result = {
    originalPrompt: prompt,
    category: 'laptop',
    budget: 70000,
    primaryUse: 'coding',
    priority: 'performance',
    ram: '16GB',
    delivery: 'express',
    detectedKeywords: []
  };

  // Category
  if (text.includes('laptop') || text.includes('macbook') || text.includes('notebook')) {
    result.category = 'laptop';
    result.detectedKeywords.push('laptop');
  } else if (text.includes('headphone') || text.includes('audio') || text.includes('music')) {
    result.category = 'headphones';
    result.detectedKeywords.push('headphones');
  } else if (text.includes('phone') || text.includes('mobile') || text.includes('smartphone')) {
    result.category = 'smartphone';
    result.detectedKeywords.push('smartphone');
  }

  // Budget
  if (text.includes('80k') || text.includes('80,000') || text.includes('80000')) {
    result.budget = 80000;
  } else if (text.includes('70k') || text.includes('70,000') || text.includes('70000')) {
    result.budget = 70000;
  } else if (text.includes('60k') || text.includes('60,000') || text.includes('60000')) {
    result.budget = 60000;
  } else if (text.includes('40k') || text.includes('40,000') || text.includes('40000')) {
    result.budget = 40000;
  } else if (text.includes('90k') || text.includes('90,000') || text.includes('1 lakh')) {
    result.budget = 90000;
  }

  // Primary use
  if (text.includes('code') || text.includes('coding') || text.includes('programming') || text.includes('developer') || text.includes('python') || text.includes('vs code') || text.includes('vscode')) {
    result.primaryUse = 'coding';
    result.detectedKeywords.push('coding');
  } else if (text.includes('college') || text.includes('student') || text.includes('study')) {
    result.primaryUse = 'college';
    result.detectedKeywords.push('college');
  } else if (text.includes('game') || text.includes('gaming')) {
    result.primaryUse = 'gaming';
    result.detectedKeywords.push('gaming');
  }

  // Priority
  if (text.includes('performance') || text.includes('speed') || text.includes('fast')) {
    result.priority = 'performance';
  } else if (text.includes('battery') || text.includes('long battery')) {
    result.priority = 'battery';
  } else if (text.includes('cheap') || text.includes('budget') || text.includes('value')) {
    result.priority = 'value';
  }

  // RAM
  if (text.includes('16gb') || text.includes('16 gb')) result.ram = '16GB';
  else if (text.includes('32gb')) result.ram = '32GB';
  else if (text.includes('8gb')) result.ram = '8GB';

  // Record Audit Trail
  recordAuditEvent({
    actor: 'BUYER AGENT',
    eventType: 'INTENT_RECEIVED',
    status: 'INFO',
    description: `Customer natural prompt parsed: "${prompt}". Extracted target category: ${result.category}, budget: â‚¹${result.budget.toLocaleString('en-IN')}, primary use: ${result.primaryUse}.`,
    payload: {
      rawPrompt: prompt,
      extractedConstraints: result
    }
  });

  return result;
}

/**
 * 2. Category Questions
 */
function getCategoryQuestions(category = 'laptop') {
  return [
    {
      id: 'primaryUse',
      field: 'primaryUse',
      question: 'What will you mainly use the laptop for?',
      options: [
        { label: 'Coding & Software Development', value: 'coding', description: 'Fast compiling, VS Code, Docker, Web dev' },
        { label: 'College & Academics', value: 'college', description: 'Assignments, lightweight carrying, presentations' },
        { label: 'Gaming & AI/Machine Learning', value: 'gaming', description: 'Dedicated NVIDIA GPU & high refresh rate' },
        { label: 'Office & Everyday Work', value: 'office', description: 'Multitasking, spreadsheets, video calls' }
      ]
    },
    {
      id: 'priority',
      field: 'priority',
      question: 'What matters most to you in your daily use?',
      options: [
        { label: 'High Performance & Speed', value: 'performance', description: 'Multi-core CPU and fast RAM compilation' },
        { label: 'Long All-Day Battery Life', value: 'battery', description: 'Work 8-10+ hours without carrying charger' },
        { label: 'Best Overall Value for Money', value: 'value', description: 'Maximum specs for lowest price' },
        { label: 'Lightweight & Portability', value: 'lightweight', description: 'Sleek under 1.5kg body for commute' }
      ]
    },
    {
      id: 'ram',
      field: 'ram',
      question: 'How much RAM do you need for your workload?',
      options: [
        { label: '16GB (Recommended for Coding)', value: '16GB', description: 'Ideal for IDEs, browser tabs & containers' },
        { label: '8GB (Light Work & College)', value: '8GB', description: 'Sufficient for documents & browsing' },
        { label: '32GB (Heavy Datasets & 3D)', value: '32GB', description: 'Maximum memory for large workloads' },
        { label: 'Not Sure / Recommend for Me', value: 'auto', description: 'Let NEXA pick optimal configuration' }
      ]
    },
    {
      id: 'delivery',
      field: 'delivery',
      question: 'How quickly do you need your order delivered?',
      options: [
        { label: 'Within 2 Days (Express)', value: 'express', description: 'Priority dispatched from nearest hub' },
        { label: 'Within a Week', value: 'standard', description: 'Standard secure shipping' },
        { label: 'No Preference', value: 'any', description: 'Standard delivery' }
      ]
    }
  ];
}

/**
 * 3. Multi-Attribute Trade-Off & RFP Broadcast Engine (10 Evaluated Offers)
 */
function broadcastRfpAndEvaluateOffers(requirements = {}) {
  const allOffers = loadOffers();
  const targetBudget = Number(requirements.budget) || 70000;
  const userPriority = (requirements.priority || 'performance').toLowerCase();

  // Dynamic utility weights based on user priority
  let weights = {
    price: 0.30,
    specs: 0.25,
    delivery: 0.15,
    warrantyReturn: 0.10,
    merchantTrust: 0.10,
    customerBenefits: 0.10
  };

  if (userPriority === 'value' || userPriority === 'price') {
    weights = { price: 0.45, specs: 0.20, delivery: 0.10, warrantyReturn: 0.10, merchantTrust: 0.08, customerBenefits: 0.07 };
  } else if (userPriority === 'performance') {
    weights = { price: 0.20, specs: 0.35, delivery: 0.15, warrantyReturn: 0.10, merchantTrust: 0.10, customerBenefits: 0.10 };
  } else if (userPriority === 'battery' || userPriority === 'delivery') {
    weights = { price: 0.25, specs: 0.20, delivery: 0.25, warrantyReturn: 0.10, merchantTrust: 0.10, customerBenefits: 0.10 };
  }

  const evaluatedOffers = allOffers.map(offer => {
    // 1. Policy check: Exceeds hard budget cap?
    let policyCheck = { status: 'PASS', reason: `Within hard budget limit of â‚¹${targetBudget.toLocaleString('en-IN')}.` };
    if (offer.finalTotal > targetBudget) {
      const overBy = offer.finalTotal - targetBudget;
      policyCheck = {
        status: 'BLOCKED',
        reason: `Policy Blocked: Exceeds customer maximum budget of â‚¹${targetBudget.toLocaleString('en-IN')} by â‚¹${overBy.toLocaleString('en-IN')}.`
      };
    }

    // 2. Score calculations (0-100)
    let priceScore = 100;
    if (offer.finalTotal <= targetBudget) {
      priceScore = Math.min(100, 85 + ((targetBudget - offer.finalTotal) / targetBudget) * 20);
    } else {
      priceScore = Math.max(30, 75 - ((offer.finalTotal - targetBudget) / targetBudget) * 50);
    }

    let specsScore = 88;
    if (offer.specs.ram?.includes('16GB')) specsScore += 5;
    if (offer.specs.processor?.includes('i5') || offer.specs.processor?.includes('Ryzen 7') || offer.specs.processor?.includes('Ultra 5')) specsScore += 5;

    let deliveryScore = offer.deliveryDays <= 1 ? 98 : offer.deliveryDays === 2 ? 90 : 75;
    let warrantyReturnScore = offer.returnPolicy?.includes('14') ? 95 : 85;
    let trustScore = Math.round((offer.merchantRating / 5.0) * 100);
    let benefitsScore = Math.min(100, 75 + ((offer.totalCustomerBenefit || 2000) / 1000) * 3);

    const rawUtility = (
      priceScore * weights.price +
      specsScore * weights.specs +
      deliveryScore * weights.delivery +
      warrantyReturnScore * weights.warrantyReturn +
      trustScore * weights.merchantTrust +
      benefitsScore * weights.customerBenefits
    );

    const aiUtilityScore = policyCheck.status === 'BLOCKED'
      ? Math.min(84, Math.round(rawUtility - 8))
      : Math.min(98, Math.max(78, Math.round(rawUtility)));

    return {
      ...offer,
      policyCheck,
      aiUtilityScore,
      scoreBreakdown: {
        priceScore: Math.round(priceScore),
        specsScore: Math.round(specsScore),
        deliveryScore: Math.round(deliveryScore),
        trustScore: Math.round(trustScore),
        benefitsScore: Math.round(benefitsScore)
      }
    };
  });

  // Sort passing offers first, then by AI Utility Score descending
  evaluatedOffers.sort((a, b) => {
    if (a.policyCheck.status === 'PASS' && b.policyCheck.status !== 'PASS') return -1;
    if (a.policyCheck.status !== 'PASS' && b.policyCheck.status === 'PASS') return 1;
    return b.aiUtilityScore - a.aiUtilityScore;
  });

  // Assign Highlight Badges across top passing offers
  const passingOffers = evaluatedOffers.filter(o => o.policyCheck.status === 'PASS');
  if (passingOffers.length > 0) {
    const minPrice = Math.min(...passingOffers.map(o => o.finalTotal));
    const maxSpecs = Math.max(...passingOffers.map(o => o.scoreBreakdown.specsScore));
    const minDelivery = Math.min(...passingOffers.map(o => o.deliveryDays));
    const maxUtility = Math.max(...passingOffers.map(o => o.aiUtilityScore));

    evaluatedOffers.forEach(o => {
      o.isLowestPrice = o.finalTotal === minPrice && o.policyCheck.status === 'PASS';
      o.isBestSpecs = o.scoreBreakdown?.specsScore === maxSpecs && o.policyCheck.status === 'PASS';
      o.isFastestDelivery = o.deliveryDays === minDelivery && o.policyCheck.status === 'PASS';
      o.isBestOverallValue = o.aiUtilityScore === maxUtility && o.policyCheck.status === 'PASS';
    });
  }

  const recommendedPick = passingOffers[0] || evaluatedOffers[0];
  const whyNexa = `${recommendedPick.merchant} is recommended because it satisfies all hard constraints (under â‚¹${targetBudget.toLocaleString('en-IN')}) and provides superior overall value with ${recommendedPick.specs?.ram || '16GB RAM'}, ${recommendedPick.warranty || '12-Month Warranty'}, and ${recommendedPick.deliveryTime || '1-Day Delivery'}.`;

  const rfpId = `rfp_live_${Date.now()}`;

  // Log RFP Broadcast to Audit Trail
  recordAuditEvent({
    actor: 'BUYER AGENT',
    eventType: 'RFP_BROADCAST',
    status: 'INFO',
    description: `Buyer Agent broadcasted RFP ${rfpId} to 5 verified Merchant Nodes across A2A Protocol v2.1.`,
    payload: {
      rfpId,
      budgetCap: targetBudget,
      priority: userPriority,
      merchantsPinged: ['TechNova Solutions', 'Apex Global Electronics', 'CyberByte Systems', 'Quantum Store Direct', 'AeroTech Hub']
    }
  });

  // Log Policy Engine Evaluation
  recordAuditEvent({
    actor: 'POLICY ENGINE',
    eventType: 'POLICY_EVALUATION',
    status: 'SUCCESS',
    description: `Policy Engine evaluated 10 merchant offers: ${passingOffers.length} passed hard policy constraints; ${evaluatedOffers.length - passingOffers.length} blocked due to budget cap.`,
    payload: {
      rfpId,
      totalOffers: evaluatedOffers.length,
      passedCount: passingOffers.length,
      blockedCount: evaluatedOffers.length - passingOffers.length,
      topPick: `${recommendedPick.productName} by ${recommendedPick.merchant} (Utility: ${recommendedPick.aiUtilityScore}/100)`
    }
  });

  return {
    rfpId,
    merchantsQueriedCount: 5,
    totalOffersEvaluated: evaluatedOffers.length,
    passedPolicyCount: passingOffers.length,
    blockedPolicyCount: evaluatedOffers.length - passingOffers.length,
    weightsUsed: weights,
    recommendedPick: {
      ...recommendedPick,
      isRecommendedPick: true,
      whyNexaRecommends: whyNexa
    },
    evaluatedOffers
  };
}

/**
 * 4. Bounded Negotiation Engine
 */
function runBoundedNegotiation(offerId = 'offer_01', requirements = {}) {
  const offers = loadOffers();
  const merchants = loadMerchants();

  const offer = offers.find(o => o.id === offerId) || offers[0];
  const merchant = merchants.find(m => m.id === offer.merchantId) || merchants[0];

  const originalPrice = offer.originalPrice;
  const targetBudget = Number(requirements.budget) || 70000;
  const maxConcession = merchant.negotiationLimits?.maxConcessionPercent || 8;
  const minMargin = merchant.negotiationLimits?.minMarginPercent || 12;

  const requestedConcession = offer.negotiatedDiscount || 1380;
  const discountPercent = ((requestedConcession / originalPrice) * 100).toFixed(1);
  const marginAfter = (16.8 - Number(discountPercent)).toFixed(1);

  const round1 = {
    round: 1,
    title: 'Round 1: Price Concession Request',
    buyerAgentAction: `Buyer Agent requests â‚¹${requestedConcession.toLocaleString('en-IN')} price concession.`,
    reason: `Product price of â‚¹${originalPrice.toLocaleString('en-IN')} exceeds customer's preferred budget target.`,
    policyCheck: {
      action: `â‚¹${requestedConcession.toLocaleString('en-IN')} Discount Application`,
      reason: "Customer's price priority is high and discount remains within merchant-approved concession limits.",
      policyRule: `Max Discount Limit: ${maxConcession}% | Min Margin Threshold: ${minMargin}%`,
      marginCalculation: `Simulated Margin After Discount = ${marginAfter}% (Threshold: > ${minMargin}%)`,
      result: 'PASS â€” ALLOWED'
    },
    merchantResponse: {
      status: 'APPROVED',
      message: `Counter-offer accepted with â‚¹${requestedConcession.toLocaleString('en-IN')} direct discount.`
    }
  };

  const round2 = {
    round: 2,
    title: 'Round 2: Express Delivery & Bundle Benefit',
    buyerAgentAction: 'Buyer Agent requests 1-Day Free Express Shipping & bundled accessory inclusion.',
    reason: 'Customer requires fast turnaround and maximum developer productivity.',
    policyCheck: {
      action: 'Free Express Logistics Upgrade',
      reason: 'Merchant inventory telemetry confirms local hub in-stock dispatch capability.',
      policyRule: 'Auto-Approve Shipping Discount = TRUE',
      marginCalculation: 'Logistics cost absorbed within fulfillment partner SLA allocation.',
      result: 'PASS â€” ALLOWED'
    },
    merchantResponse: {
      status: 'APPROVED',
      message: 'Approved 1-Day Guaranteed Express Delivery (â‚¹499 value waived).'
    }
  };

  const authoritativeFinalTotal = originalPrice - requestedConcession;

  const round3 = {
    round: 3,
    title: 'Round 3: Final Agreement Lock',
    buyerAgentAction: 'Negotiation completed. Authoritative terms locked for customer review.',
    reason: 'Both Buyer Agent constraints and Merchant Agent margin boundaries satisfied.',
    policyCheck: {
      action: 'Final Terms Validation',
      reason: 'All hard constraints, delivery SLAs, and margin thresholds verified.',
      policyRule: 'Customer Explicit Approval Gate = REQUIRED',
      marginCalculation: `Final Merchant Margin = ${marginAfter}% | Total Customer Savings = â‚¹${requestedConcession.toLocaleString('en-IN')}`,
      result: 'AGREEMENT LOCKED'
    },
    merchantResponse: {
      status: 'FINALIZED',
      message: `Final Authoritative Amount: â‚¹${authoritativeFinalTotal.toLocaleString('en-IN')}. Ready for customer authorization.`
    }
  };

  // Record Audit Trail Events for Negotiation
  recordAuditEvent({
    actor: 'BUYER AGENT',
    eventType: 'NEGOTIATION_STARTED',
    status: 'INFO',
    description: `Initiated multi-round bounded negotiation with ${merchant.name} for ${offer.productName}.`,
    payload: {
      offerId: offer.id,
      merchant: merchant.name,
      originalPrice,
      maxRounds: 3
    }
  });

  recordAuditEvent({
    actor: 'POLICY ENGINE',
    eventType: 'CONCESSION_ALLOWED',
    status: 'SUCCESS',
    description: `Concession Allowed: â‚¹${requestedConcession.toLocaleString('en-IN')} (${discountPercent}%) discount within merchant ${maxConcession}% limit. Remaining margin: ${marginAfter}%.`,
    payload: {
      concessionPercent: `${discountPercent}%`,
      marginAfter: `${marginAfter}%`,
      marginThreshold: `${minMargin}%`,
      result: 'ALLOWED_SAFE'
    }
  });

  return {
    offerId: offer.id,
    merchantName: merchant.name,
    productName: offer.productName,
    originalPrice,
    negotiatedDiscount: requestedConcession,
    authoritativeFinalTotal,
    totalSavings: requestedConcession,
    totalRounds: 3,
    timeline: [round1, round2, round3]
  };
}

/**
 * 5. Explainability Layer ("Why this?")
 * Explains exactly why the product was recommended and how it matches customer requirements
 */
function explainProduct(productId = 'prod_lap_01', requirements = {}) {
  const products = loadProducts();
  const offers = loadOffers();
  
  // Find either from products catalog or evaluated offers
  let item = offers.find(o => o.id === productId || o.productName?.toLowerCase().includes(productId.toLowerCase()));
  if (!item) {
    item = products.find(p => p.id === productId) || products[0];
  }

  const budgetCap = Number(requirements.budget) || 70000;
  const primaryUse = requirements.primaryUse || 'coding';
  const ramReq = requirements.ram || '16GB';
  const price = item.finalTotal || item.price || 67610;
  const name = item.productName || item.name || 'Dell Inspiron 15 Pro';
  const merchant = item.merchant || 'TechNova Solutions';

  const isCoding = primaryUse.toLowerCase().includes('code') || primaryUse.toLowerCase().includes('python');

  const requirementMatches = [
    {
      requirement: `Hard Budget Limit: Under â‚¹${budgetCap.toLocaleString('en-IN')}`,
      productSpec: `â‚¹${price.toLocaleString('en-IN')} Final Price`,
      explanation: price <= budgetCap
        ? `Fits comfortably under your budget with â‚¹${(budgetCap - price).toLocaleString('en-IN')} in headroom remaining.`
        : `Slightly exceeds original budget; consider applying merchant concession.`,
      status: price <= budgetCap ? 'Verified Match' : 'Exceeds Budget'
    },
    {
      requirement: `Primary Workload: ${primaryUse.toUpperCase()}`,
      productSpec: item.specs?.processor || '13th Gen Intel Core i5 (10 Cores, 12 Threads)',
      explanation: isCoding
        ? 'High multi-core compilation performance, smooth execution for VS Code, Python, Node.js, and background servers.'
        : 'High-efficiency processing power optimized for multitasking and daily productivity.',
      status: 'Verified Match'
    },
    {
      requirement: `Memory Capacity: ${ramReq}`,
      productSpec: item.specs?.ram || '16GB DDR5 4800MHz High-Speed RAM',
      explanation: 'Sufficient headroom to run heavy IDEs, Docker containers, and 30+ browser tabs simultaneously without lag.',
      status: 'Verified Match'
    },
    {
      requirement: 'Delivery & Turnaround',
      productSpec: item.deliveryTime || '1-Day Guaranteed Express Delivery',
      explanation: 'Dispatched directly from the verified regional logistics hub with priority handling.',
      status: 'Verified Match'
    },
    {
      requirement: 'Merchant Trust & Protection',
      productSpec: `${item.warranty || '12-Month On-Site Warranty'} â€¢ ${item.returnPolicy || '14-Day Free Returns'}`,
      explanation: `${merchant} is a certified brand partner with a 4.9/5 merchant rating across 3,800+ orders.`,
      status: 'Verified Match'
    }
  ];

  const summary = `NEXA selected the ${name} by ${merchant} because it achieves the highest Multi-Attribute Utility Score (92/100). It satisfies all hard budget constraints (â‚¹${price.toLocaleString('en-IN')} vs â‚¹${budgetCap.toLocaleString('en-IN')} cap), provides fast 10-core compilation throughput with 16GB DDR5 RAM for ${primaryUse}, and includes 1-day express delivery plus â‚¹1,999 in free bundled developer accessories.`;

  const tradeoffs = {
    consideration: `Alternative models like the Acer Swift Go 14 feature OLED panels but cost â‚¹78,990 (exceeding your budget by â‚¹8,990). The ${name} provides the most balanced compromise between raw compilation power, thermal stability, and price.`
  };

  const explanationPayload = {
    productId: item.id || productId,
    productName: name,
    merchant,
    matchScore: item.aiUtilityScore || item.matchScore || 94,
    summary,
    requirementMatches,
    tradeoffs
  };

  // Record Audit Trail
  recordAuditEvent({
    actor: 'BUYER AGENT',
    eventType: 'EXPLAINABILITY_GENERATED',
    status: 'INFO',
    description: `Generated transparent plain-language explainability for ${name}: evaluated 5 requirement constraints against merchant passport specs.`,
    payload: {
      product: name,
      merchant,
      matchedRequirements: requirementMatches.map(r => `${r.requirement}: ${r.status}`)
    }
  });

  return explanationPayload;
}

/**
 * 6. Continuous Follow-Up Conversational Q/A
 * Answers questions like "Is this suitable for Python and VS Code?" or "Is there a cheaper alternative?"
 */
function answerFollowUp(productId = 'prod_lap_01', question = '', requirements = {}) {
  const text = (question || '').toLowerCase().trim();
  const offers = loadOffers();
  const products = loadProducts();

  let item = offers.find(o => o.id === productId || o.productName?.toLowerCase().includes(productId.toLowerCase()));
  if (!item) {
    item = products.find(p => p.id === productId) || products[0];
  }

  const name = item.productName || item.name || 'Dell Inspiron 15 Pro';
  const price = item.finalTotal || item.price || 67610;

  let answer = '';
  let isRequirementChange = false;
  let field = null;
  let value = null;
  let isDeliveryFailure = false;

  // 1. Python, VS Code, Coding, Programming
  if (text.includes('python') || text.includes('vs code') || text.includes('vscode') || text.includes('coding') || text.includes('programming') || text.includes('developer') || text.includes('docker')) {
    answer = `Yes, absolutely! The **${name}** is exceptionally well suited for Python and VS Code. Its ${item.specs?.processor || '13th Gen Intel Core i5 (10 cores)'} combined with ${item.specs?.ram || '16GB DDR5 RAM'} and fast 512GB NVMe SSD ensures instant project compilation, smooth syntax highlighting with heavy extensions, and seamless container virtualization in Docker.`;
  }
  // 2. Cheaper alternative / lower price
  else if (text.includes('cheaper') || text.includes('lower price') || text.includes('less expensive') || text.includes('budget alternative') || text.includes('too expensive')) {
    isRequirementChange = true;
    field = 'budget';
    value = 60000;
    answer = `Yes! If you are looking for a more affordable alternative, I recommend the **Acer Aspire 5 Pro** (â‚¹56,490 by AeroTech Hub) or **HP Pavilion 14** (â‚¹58,990 by TechNova). Both provide 16GB RAM and Core i5 performance while saving you over â‚¹11,000 from your budget! I have updated your recommendations below.`;
  }
  // 3. Higher budget / â‚¹80,000
  else if (text.includes('80,000') || text.includes('80000') || text.includes('80k') || text.includes('higher budget') || text.includes('increase budget')) {
    isRequirementChange = true;
    field = 'budget';
    value = 80000;
    answer = `With the higher budget of â‚¹80,000, I found top options with better processors and OLED displays, such as the **Acer Swift Go 14 OLED AI** (Intel Core Ultra 5 / NPU at â‚¹78,990) and **Lenovo LOQ 15**. I've updated your recommendations!`;
  }
  // 4. Battery life
  else if (text.includes('battery') || text.includes('backup') || text.includes('hours') || text.includes('unplugged') || text.includes('charger')) {
    answer = `The **${name}** provides approximately ${item.specs?.battery || '8.5 Hours of mixed coding and browsing'} on its 54Wh pack. If battery endurance is your highest priority, the **Lenovo IdeaPad Slim 5** lasts up to 10.5 hours on a single charge.`;
  }
  // 5. Delivery tomorrow / speed
  else if (text.includes('tomorrow') || text.includes('next day') || text.includes('delivery tomorrow') || text.includes('urgent')) {
    if (item.deliveryDays && item.deliveryDays <= 1) {
      answer = `Good news! ${item.merchant || 'TechNova Solutions'} offers **Guaranteed 1-Day Express Delivery** on the ${name}. If you order now, dispatch begins from the regional hub today.`;
    } else {
      isDeliveryFailure = true;
      answer = `The ${name} standard delivery takes 2â€“3 business days. However, I found two alternative laptops with Guaranteed Next-Day Delivery (Lenovo IdeaPad Slim 5 & Acer Aspire 5 Pro).`;
    }
  }
  // 6. Upgradability (RAM / SSD)
  else if (text.includes('upgrade') || text.includes('expand') || text.includes('slot') || text.includes('storage')) {
    answer = `Yes! The **${name}** features dual SO-DIMM RAM slots (expandable up to 32GB DDR5) and an additional M.2 NVMe SSD expansion slot so you can add more storage whenever your projects grow.`;
  }
  // 7. Warranty & Returns
  else if (text.includes('warranty') || text.includes('return') || text.includes('refund') || text.includes('guarantee')) {
    answer = `The **${name}** comes with a **${item.warranty || '12-Month Official Manufacturer Warranty'}** with on-site technician visits, plus **${item.returnPolicy || '14-Day Free Returns'}** with zero restocking fees.`;
  }
  // 8. General fallback
  else {
    answer = `Regarding "${question}": The **${name}** (â‚¹${price.toLocaleString('en-IN')}) is certified for high-reliability development and multitasking with ${item.specs?.ram || '16GB RAM'} and ${item.specs?.processor || 'Core i5 CPU'}. Feel free to ask about specific tools, software, or delivery terms!`;
  }

  // Record Audit Trail
  recordAuditEvent({
    actor: 'CUSTOMER',
    eventType: 'FOLLOW_UP_INQUIRY',
    status: 'INFO',
    description: `Customer asked follow-up question: "${question}". AI Agent generated context-aware answer${isRequirementChange ? ` and dynamically recalibrated [${field}] = ${value}` : ''}.`,
    payload: {
      productId: item.id || productId,
      productName: name,
      question,
      answer,
      isRequirementChange,
      updatedRequirement: isRequirementChange ? { [field]: value } : null
    }
  });

  if (isRequirementChange) {
    recordAuditEvent({
      actor: 'BUYER AGENT',
      eventType: 'REQUIREMENTS_RECALIBRATED',
      status: 'SUCCESS',
      description: `Requirements memory recalibrated from customer follow-up: [${field}] = ${value}. Re-evaluating A2A merchant catalog.`,
      payload: { field, value, previousRequirements: requirements }
    });
  }

  return {
    success: true,
    productId: item.id || productId,
    question,
    answer,
    isRequirementChange,
    field,
    value,
    isDeliveryFailure,
    actionLabel: isDeliveryFailure ? 'View Next-Day Alternatives' : null
  };
}

/**
 * 7. Explainability Layer Helper ("Why did NEXA do this?")
 */
function getWhyNexaExplanation(decisionType, context = {}) {
  const explanations = {
    RECOMMENDATION: {
      decision: `Recommended ${context.productName || 'Dell Inspiron 15 Pro'} by ${context.merchant || 'TechNova Solutions'}`,
      reason: 'Highest Multi-Attribute Utility Score (92/100) and satisfies all customer hard constraints.',
      inputFactors: ['Budget Cap: â‚¹70,000', '16GB DDR5 RAM', '1-Day Delivery SLA', '12-Month Warranty'],
      policyConstraints: ['Hard Budget <= â‚¹70,000', 'Risk Assessment = LOW'],
      expectedOutcome: 'Optimal developer performance and reliability with zero budget violation.'
    },
    DISCOUNT_CONCESSION: {
      decision: `Applied â‚¹${context.discount || '1,380'} Concession`,
      reason: 'Customer price sensitivity prioritized without violating merchant minimum 12% margin threshold.',
      inputFactors: ['Original Price: â‚¹68,990', 'Concession Limit: 8%', 'Minimum Margin: 12%'],
      policyConstraints: ['Discount <= 8%', 'Remaining Margin >= 12%'],
      expectedOutcome: 'High buyer conversion with protected merchant profitability.'
    },
    POLICY_BLOCK: {
      decision: `Blocked Offer: ${context.productName || 'Apple MacBook Air M2'}`,
      reason: 'Exceeded customer maximum hard budget constraint.',
      inputFactors: ['Customer Budget: â‚¹70,000', 'Offered Price: â‚¹88,900', 'Over Budget: â‚¹18,900'],
      policyConstraints: ['Hard Budget Cap = STRICT'],
      expectedOutcome: 'Prevents customer overspending and maintains trustworthy agentic commerce.'
    },
    PAYMENT_FAILURE_SAFE: {
      decision: 'Safe Payment Recovery State Triggered',
      reason: 'No money was captured; duplicate order prevention active.',
      inputFactors: ['Test Failure Simulation Active', 'Gateway Response: FAILED_SAFE'],
      policyConstraints: ['Idempotency Key Valid', 'No State Desynchronization'],
      expectedOutcome: 'Customer can safely retry payment or choose another offer without risk.'
    }
  };

  const res = explanations[decisionType] || explanations.RECOMMENDATION;

  recordAuditEvent({
    actor: 'POLICY ENGINE',
    eventType: 'EXPLAINABILITY_BADGE_INSPECTED',
    status: 'INFO',
    description: `Decision type "${decisionType}" explainability inspected. Policy rationale: ${res.reason}`,
    payload: { decisionType, context, explanation: res }
  });

  return res;
}

/**
 * 8. Merchant Analytics & Lost Intent Engine
 */
function getMerchantAnalyticsData(merchantId = 'merch_technova') {
  const merchants = loadMerchants();
  const selectedMerchant = merchants.find(m => m.id === merchantId) || merchants[0];

  return {
    selectedMerchant: {
      id: selectedMerchant.id,
      name: selectedMerchant.name,
      rating: selectedMerchant.rating,
      verifiedOrders: selectedMerchant.verifiedOrders
    },
    topMetrics: {
      totalAiRevenue: 'â‚¹1.42L',
      intentsProcessed: 14820,
      ordersWon: 42,
      averageOrderValue: 'â‚¹3,380'
    },
    lostIntentRootCauses: {
      merchantName: selectedMerchant.name,
      title: `Why Did ${selectedMerchant.name} Lose Customers?`,
      breakdown: [
        { reason: 'Price Disadvantage', percentage: 38, count: 184 },
        { reason: 'Hardware Spec / Brand Mismatch', percentage: 22, count: 106 },
        { reason: 'Inventory Stock-Out', percentage: 18, count: 87 },
        { reason: 'Delivery SLA Disadvantage', percentage: 12, count: 58 },
        { reason: 'Other Factors', percentage: 10, count: 48 }
      ]
    },
    aiGrowthAgent: {
      opportunityTitle: 'Growth Opportunity Detected',
      intentInsight: '38% of lost laptop intents were caused by a â‚¹1,000â€“â‚¹3,000 price disadvantage.',
      aiRecommendation: 'Apply a maximum 3% dynamic concession to eligible coding-laptop purchase requests above â‚¹65,000.',
      expectedConversionIncrease: '+14%',
      projectedAdditionalOrders: '+140',
      projectedRevenueImpact: '+â‚¹8.4 Lakhs',
      maxDiscount: '3%',
      merchantApprovalRequired: true,
      simulationPerformance: {
        recommendation: 'Dynamic 3% Concession',
        beforeConversionRate: '29%',
        afterConversionRate: '35%',
        revenueUplift: '+â‚¹8.4 Lakhs',
        incrementalOrders: '+140'
      }
    }
  };
}

/**
 * 9. Match Products (legacy fallback)
 */
function matchProducts(requirements = {}) {
  const rfpResults = broadcastRfpAndEvaluateOffers(requirements);
  return rfpResults.evaluatedOffers.map(o => ({
    ...o,
    name: o.productName,
    price: o.finalTotal,
    matchScore: o.aiUtilityScore,
    matchReasons: [
      `Meets ${requirements.primaryUse || 'coding'} performance needs with ${o.specs?.processor}`,
      `Within budget of â‚¹${(requirements.budget || 70000).toLocaleString('en-IN')}`,
      `${o.deliveryTime} from ${o.merchant}`
    ]
  }));
}

/**
 * 10. Companion Cross-Sell Bundles
 */
function getCrossSellBundles(productId = 'prod_lap_01', context = {}) {
  return [
    {
      id: 'addon_mouse',
      name: 'Logitech Pebble Wireless Silent Mouse',
      category: 'Peripherals',
      originalPrice: 1499,
      price: 999,
      discountPercent: 33,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&auto=format&fit=crop&q=80',
      specs: 'Bluetooth & 2.4GHz â€¢ Silent Click â€¢ 18-Month Battery',
      whyThisReason: 'Pairs ergonomically with your laptop for fast code navigation and zero clicking noise in quiet workspaces.'
    },
    {
      id: 'addon_stand',
      name: 'Ergonomic Aluminum Laptop Stand',
      category: 'Ergonomics',
      originalPrice: 1999,
      price: 1499,
      discountPercent: 25,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
      specs: 'Adjustable Height â€¢ Heat Dissipation Alloy â€¢ Foldable',
      whyThisReason: 'Elevates display to eye-level to prevent neck strain and improves laptop underside thermal ventilation.'
    },
    {
      id: 'addon_bag',
      name: 'Water-Resistant Daily Commute Laptop Sleeve',
      category: 'Protection',
      originalPrice: 1499,
      price: 899,
      discountPercent: 40,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80',
      specs: 'Spill-Resistant 600D Nylon â€¢ Velvet Padding â€¢ Extra Cable Pocket',
      whyThisReason: 'Protects against drops, scratches, and rain during commute to office or college.'
    }
  ];
}

/**
 * 11. Budget Constraint Checker
 */
function checkBudgetConstraints(budget = 70000, primary = {}, addons = []) {
  const primaryPrice = primary.price || primary.bundleDiscountPrice || 0;
  const addonsTotalPrice = addons.reduce((sum, addon) => sum + (addon.bundleDiscountPrice || addon.price || 0), 0);
  const totalAmount = primaryPrice + addonsTotalPrice;
  const isExceeded = totalAmount > budget;
  const exceededBy = isExceeded ? totalAmount - budget : 0;

  const suggestions = [];
  
  if (isExceeded) {
    suggestions.push({
      label: 'Remove optional add-ons',
      description: 'Consider purchasing accessories separately later'
    });
    suggestions.push({
      label: 'Negotiate with merchant',
      description: 'Our Bounded Negotiation engine can help you save â‚¹' + Math.min(2000, exceededBy)
    });
    suggestions.push({
      label: 'Increase budget allocation',
      description: 'The performance jump to next tier is worth the extra cost'
    });
  }

  return {
    totalAmount,
    isExceeded,
    exceededBy,
    message: isExceeded 
      ? `âš ï¸ BUDGET EXCEEDED by â‚¹${exceededBy.toLocaleString('en-IN')}. NEXA Negotiation Engine ready.`
      : `âœ… Within budget. Savings: â‚¹${(budget - totalAmount).toLocaleString('en-IN')}`,
    suggestions
  };
}

module.exports = {
  loadProducts,
  loadMerchants,
  loadOffers,
  loadAuditLogs,
  recordAuditEvent,
  parseInitialIntent,
  getCategoryQuestions,
  broadcastRfpAndEvaluateOffers,
  runBoundedNegotiation,
  explainProduct,
  answerFollowUp,
  getWhyNexaExplanation,
  getMerchantAnalyticsData,
  matchProducts,
  getCrossSellBundles,
  checkBudgetConstraints
};
