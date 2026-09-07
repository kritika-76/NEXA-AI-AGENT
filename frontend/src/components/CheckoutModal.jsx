import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ShieldCheck, Lock, CreditCard, Smartphone, Building2, Truck, Sparkles, ArrowRight, RotateCcw, AlertTriangle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { paymentService } from '../services/api';

export default function CheckoutModal({
  orderData,
  requirements,
  onClose,
  onOrderSuccess
}) {
  const [formData, setFormData] = useState({
    name: 'Rohit Sharma',
    email: 'rohit.developer@example.com',
    phone: '9876543210',
    address: 'Flat 402, Green Acres Apt, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [paymentFailed, setPaymentFailed] = useState(false);

  if (!orderData) return null;

  const { primaryProduct, addons, totalAmount, totalSavings } = orderData;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate dynamic "Why this order?" explanation
  const generateWhyThisOrder = () => {
    let text = `This ${primaryProduct.name} was selected because it best matched your ${requirements.primaryUse || 'coding'} requirements and ${requirements.priority || 'performance'} priority.`;
    if (addons.length > 0) {
      const addonNames = addons.map(a => a.name).join(' and ');
      text += ` The ${addonNames} ${addons.length > 1 ? 'were' : 'was'} added because you chose ${addons.length > 1 ? 'them' : 'it'} after NEXA suggested ${addons.length > 1 ? 'them' : 'it'} as relevant companion accessories.`;
    }
    return text;
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    setPaymentFailed(false);

    try {
      // 1. Create order on backend
      const orderPayload = {
        amount: totalAmount,
        currency: 'INR',
        receipt: `nexa_${Date.now()}`,
        items: [
          { id: primaryProduct.id, name: primaryProduct.name, price: primaryProduct.price },
          ...addons.map(a => ({ id: a.id, name: a.name, price: a.bundleDiscountPrice || a.price }))
        ],
        customerInfo: formData
      };

      const orderResponse = await paymentService.createOrder(orderPayload);

      // If simulate failure is checked, trigger graceful failure screen
      if (simulateFailure) {
        setTimeout(() => {
          setIsProcessing(false);
          setPaymentFailed(true);
        }, 1200);
        return;
      }

      // Check if real Razorpay SDK is available and has valid live key
      if (!orderResponse.isSimulated && window.Razorpay && orderResponse.keyId && !orderResponse.keyId.includes('demo')) {
        const options = {
          key: orderResponse.keyId,
          amount: orderResponse.order.amount,
          currency: 'INR',
          name: 'NEXA Agentic Commerce',
          description: `Order for ${primaryProduct.name}`,
          order_id: orderResponse.order.id,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: '#0284c7' },
          handler: async function (response) {
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isSimulated: false
            });
            handleSuccess(verifyRes.orderId, verifyRes.paymentId);
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Smooth test simulation
        setTimeout(async () => {
          const fakePaymentId = `pay_rzp_test_${Date.now()}`;
          const fakeOrderId = orderResponse.order.id;

          await paymentService.verifyPayment({
            razorpay_order_id: fakeOrderId,
            razorpay_payment_id: fakePaymentId,
            isSimulated: true
          });

          handleSuccess(fakeOrderId, fakePaymentId);
        }, 1400);
      }
    } catch (err) {
      console.error('Payment checkout error:', err);
      setIsProcessing(false);
      setPaymentFailed(true);
    }
  };

  const handleSuccess = (orderId, paymentId) => {
    setIsProcessing(false);
    setPaymentFailed(false);
    setCompletedOrder({
      orderId,
      paymentId,
      merchant: primaryProduct.merchant,
      totalAmount,
      customer: formData,
      primaryProduct,
      addons,
      deliveryDays: primaryProduct.deliveryDays,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onOrderSuccess) onOrderSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Lock className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {completedOrder
                    ? 'PAYMENT SUCCESSFUL'
                    : paymentFailed
                    ? 'PAYMENT NOT COMPLETED'
                    : 'Review Your Order'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
                  Razorpay Test Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {completedOrder
                  ? 'Your transaction has been confirmed securely'
                  : paymentFailed
                  ? 'Safe transaction recovery flow'
                  : 'Customer Approval Gate • Explicit authorization before charging'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {completedOrder ? (
          /* SUCCESS SCREEN */
          <div className="p-6 space-y-6 animate-fade-in">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">PAYMENT SUCCESSFUL</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your order has been authorized and dispatched to merchant
              </p>
            </div>

            {/* Official Order Receipt */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block">Order ID</span>
                  <span className="font-mono font-bold text-slate-900 text-[13px]">{completedOrder.orderId}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Payment ID</span>
                  <span className="font-mono font-bold text-slate-900 text-[13px]">{completedOrder.paymentId}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Merchant</span>
                  <span className="font-bold text-slate-900">{completedOrder.merchant}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Timestamp</span>
                  <span className="font-medium text-slate-700">{completedOrder.createdAt}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-1">
                <span className="font-bold uppercase tracking-wider text-slate-400 block text-[10px]">
                  Order Items
                </span>
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>1x {completedOrder.primaryProduct.name}</span>
                  <span>₹{completedOrder.primaryProduct.price.toLocaleString('en-IN')}</span>
                </div>
                {completedOrder.addons.map(a => (
                  <div key={a.id} className="flex justify-between text-slate-600">
                    <span>1x {a.name} (AI Companion Bundle)</span>
                    <span>₹{(a.bundleDiscountPrice || a.price).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Total Paid */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-extrabold text-slate-900">Amount Paid</span>
                <span className="text-xl font-black text-emerald-700">
                  ₹{completedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Return to NEXA
            </button>
          </div>
        ) : paymentFailed ? (
          /* FAILURE SCREEN */
          <div className="p-6 space-y-6 animate-fade-in">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-rose-500/20">
                <XCircle className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">PAYMENT NOT COMPLETED</h3>
              <p className="text-xs text-rose-700 font-medium mt-1">
                Your payment was not completed successfully. No duplicate order has been created.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p>• Your bank account or test card has not been debited.</p>
              <p>• Your selected products and bundle discounts have been preserved.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setPaymentFailed(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                Return to Order
              </button>
              <button
                onClick={() => {
                  setSimulateFailure(false);
                  handlePayNow();
                }}
                className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Payment</span>
              </button>
            </div>
          </div>
        ) : (
          /* ORDER APPROVAL GATE VIEW */
          <div className="p-6 space-y-6">
            {/* 1. Review Your Order Items Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Order Items & Pricing
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{primaryProduct.name}</span>
                    <span className="text-[11px] text-slate-500">Merchant: {primaryProduct.merchant}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{primaryProduct.price.toLocaleString('en-IN')}
                  </span>
                </div>

                {addons.map(a => (
                  <div key={a.id} className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="font-semibold text-slate-800 block">{a.name} (Add-on)</span>
                      <span className="text-[10px] text-emerald-700 font-bold">Bundle Discount Applied</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{(a.bundleDiscountPrice || a.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}

                {totalSavings > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-bold pt-1">
                    <span>Discount / Savings</span>
                    <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-slate-800">Final Total</span>
                  <span className="text-xl font-black text-sky-700">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. "Why this order?" Explainability Box */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                Why this order?
              </span>
              <p className="text-xs text-sky-950 leading-relaxed font-medium">
                {generateWhyThisOrder()}
              </p>
            </div>

            {/* 3. Customer & Shipping Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Shipping Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment Test Method & Failure Simulation Toggle */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Payment Option</span>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>Simulate Payment Failure Test</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                  <span className="text-xs">UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <span className="text-xs">Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs">NetBanking</span>
                </button>
              </div>
            </div>

            {/* Explicit Approval CTA */}
            <div className="pt-3 flex items-center justify-between gap-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="flex-1 px-6 py-3.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing with Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Payment (₹{totalAmount.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
