<<<<<<< HEAD
# NEXA — Your AI Shopping Agent
> **“Answer a few questions. Find what truly fits you.”**
> 
> *Built for Razorpay Buildathon Track 01: AI Growth & Agentic Commerce*

---

## 🌟 Executive Summary

Traditional e-commerce overwhelms shoppers with hundreds of technical filters, endless browsing, and analysis paralysis. Customers often leave without buying because they cannot answer one fundamental question: **"Which product is actually right for me?"**

**NEXA** transforms the shopping journey into a fast, intelligent, and interactive conversational experience:
1. **Understands Intent**: Natural language parsing of constraints, budget, and use case.
2. **Smart Dynamic Q/A**: 3–4 tailored questions with rapid clickable chips.
3. **Hero Feature — Live Requirements Memory**: Persistent memory bar with editable criteria chips (Budget, Use Case, Priority, Specs, Delivery) that dynamically recalculates recommendations upon any edit.
4. **Top 3 Explainable Recommendations**: Displays why each product was chosen with match percentages and verified requirement checks.
5. **Product Follow-Up & Comparison**: Real-time contextual Q/A and side-by-side spec comparison.
6. **Explainable Companion Cross-Sell**: Intelligently recommends complementary add-ons with bundle discounts and transparent rationale.
7. **Explicit Order Approval & Razorpay Test Checkout**: Transparent order review and secure checkout via Razorpay Test Mode & Simulator with instant receipt.
8. **Merchant AI Growth Insights**: Actionable conversion analytics (+286% uplift vs traditional search, +21.4% AOV boost) and revenue opportunities.
9. **AI-Ready Catalog**: Semantic intent triggers, use-case strength benchmarks, and test playground.

---

## 🏗️ Architecture

```
NEXA-AI_Agent/
├── backend/                  # Node.js + Express backend
│   ├── data/
│   │   └── products.json     # Seeded rich product catalog with agentic metadata
│   ├── routes/
│   │   ├── aiRoutes.js       # Intent, Q/A, Match, Explain, Follow-up, Cross-sell
│   │   ├── productRoutes.js  # Catalog search & inspection
│   │   ├── merchantRoutes.js # Growth metrics & catalog audit
│   │   └── paymentRoutes.js  # Razorpay test order creation & verification
│   ├── services/
│   │   └── aiEngine.js       # Modular deterministic & semantic AI engine
│   ├── server.js             # Express server entry point
│   └── package.json
│
├── frontend/                 # React + Vite + TailwindCSS frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Brand header, links, AI activity toggle
│   │   │   ├── ConversationalFlow.jsx   # Hero prompt, voice input, dynamic Q/A
│   │   │   ├── RequirementsMemory.jsx   # Hero editable chips & live recalculation
│   │   │   ├── ProductCard.jsx          # Match score badge, verified specs & CTAs
│   │   │   ├── ExplainabilityModal.jsx  # "Why this product?" rationale & checks
│   │   │   ├── ComparisonModal.jsx      # Side-by-side spec comparison
│   │   │   ├── ProductFollowUpChat.jsx  # Contextual product Q/A drawer
│   │   │   ├── CrossSellModal.jsx       # Explainable cross-sell & bundle savings
│   │   │   ├── CheckoutModal.jsx        # Razorpay Test Checkout & Order Receipt
│   │   │   └── AIActivityDrawer.jsx     # Live agent reasoning & memory inspector
│   │   ├── pages/
│   │   │   ├── ShopPage.jsx             # Core customer shopping experience
│   │   │   ├── MerchantPage.jsx         # AI growth & merchant insights dashboard
│   │   │   └── CatalogPage.jsx          # AI-Ready catalog & query playground
│   │   ├── services/
│   │   │   └── api.js                   # Axios API service client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start the Backend Server
```bash
cd backend
npm install
npm start
```
*Backend runs on: `http://localhost:5000`*

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 💳 Razorpay Test Mode Setup

- **Out of the box**: NEXA is pre-configured with an interactive **Razorpay Test Simulator** requiring zero external API credentials for instant evaluation.
- **To use your own Razorpay Test Keys**:
  Create a `.env` file in `backend/`:
  ```env
  PORT=5000
  RAZORPAY_KEY_ID=rzp_test_your_key_id
  RAZORPAY_KEY_SECRET=your_secret_key
  ```

---

## 🏆 Key Buildathon Innovations

1. **Zero Cold-Start Dependency**: Works 100% offline with zero external API key requirements while supporting LLM expansion.
2. **Hero Feature — Requirements Memory**: Interactive editable memory chips that immediately recalibrate product scores upon edit.
3. **Complete Explainability**: No black boxes. Customers see the exact reasons, requirement checks, and trade-offs.
4. **Agentic Commerce Growth**: Merchants gain real-time visibility into intent trends, unmet customer demands, and AOV uplift from companion bundling.
=======
# NEXA-AI-AGENT
 AI Growth &amp; Agentic Commerce track.”
>>>>>>> origin/main
