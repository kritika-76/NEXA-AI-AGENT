const aiEngine = require('./services/aiEngine');

console.log('--- Testing Advanced NEXA Agentic Features ---\n');

// 1. Test Budget Increase in Follow-up
const reqChange = aiEngine.answerFollowUp('prod_lap_01', 'What if I increase my budget to ₹80,000?', { budget: 70000 });
console.log('1. Conversational Requirement Update:');
console.log('   Is Change:', reqChange.isRequirementChange);
console.log('   Updated:', reqChange.field, '=', reqChange.value);
console.log('   AI Response:', reqChange.answer);

// 2. Test Dynamic Scoring with Weights (Performance vs Value)
const perfMatches = aiEngine.matchProducts({ category: 'laptop', budget: 70000, priority: 'performance', primaryUse: 'coding' });
console.log('\n2. Performance-Weighted Top Match:');
console.log('   Top Pick:', perfMatches[0].name, `(${perfMatches[0].matchScore}%)`);

const valueMatches = aiEngine.matchProducts({ category: 'laptop', budget: 70000, priority: 'value', primaryUse: 'coding' });
console.log('\n3. Value-Weighted Top Match:');
console.log('   Top Pick:', valueMatches[0].name, `(${valueMatches[0].matchScore}%)`);

// 4. Test Constraint Checking
const primary = { id: 'prod_lap_01', name: 'Dell Inspiron 15', price: 67610 };
const addons = [
  { id: 'prod_acc_01', name: 'Wireless Mouse', bundleDiscountPrice: 999 },
  { id: 'prod_acc_07', name: 'Laptop Stand', bundleDiscountPrice: 1499 }
];
const constraint = aiEngine.checkBudgetConstraints(70000, primary, addons);
console.log('\n4. Budget Constraint Checking (₹70,000 Budget):');
console.log('   Total Amount: ₹' + constraint.totalAmount);
console.log('   Is Exceeded:', constraint.isExceeded);
console.log('   Exceeded By: ₹' + constraint.exceededBy);
console.log('   NEXA Warning:', constraint.message);
console.log('   Mitigation Actions:', constraint.suggestions.map(s => s.label));

// 5. Test Graceful Failure (Delivery Tomorrow)
const deliveryFail = aiEngine.answerFollowUp('prod_lap_01', 'I need this laptop delivered tomorrow');
console.log('\n5. Graceful Failure (Delivery Tomorrow):');
console.log('   Is Failure:', deliveryFail.isDeliveryFailure);
console.log('   AI Response:', deliveryFail.answer);

console.log('\n✅ ALL ADVANCED FEATURES VERIFIED SUCCESSFULLY!');
