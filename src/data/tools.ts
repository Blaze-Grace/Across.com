import { SaaSTool } from '../types';

export const TOOLS: SaaSTool[] = [
  {
    id: 1,
    slug: 'converse-qa',
    name: 'Across ConverseQA',
    shortName: 'ConverseQA',
    category: 'Customer Support & QA',
    filterCategory: 'Support QA',
    persona: 'Support Leads & Service Co.',
    tagline: 'Simple, automated conversation quality assurance for small service teams.',
    shortDesc: 'Evaluate customer conversations, identify unanswered questions, detect repeated customer complaints, and generate actionable quality reports.',
    detailDesc: 'Small service teams rely on manual spot-checks and expensive enterprise contact-center platforms that are overbuilt for their needs. ConverseQA connects to your support channels, scans 100% of tickets, scores agent responses, flags churn indicators, and exports polished executive QA summaries in one click.',
    problem: 'Small service teams need a simpler, affordable quality-assurance product instead of complex, expensive enterprise contact-center software.',
    features: [
      'Automated conversation scoring across all channels',
      'Unanswered question detection & escalation alerts',
      'Recurring complaint clustering & pattern analysis',
      'Downloadable quality reports with actionable insights'
    ],
    competitors: ['MaestroQA', 'Rippit', 'Zendesk QA', 'EvaluAgent', 'Level AI'],
    pricingFutureINR: '₹999–₹1,999',
    pricingFutureUSD: '$15–$25',
    icon: '💬',
    color: '#0284C7',
    roiMetric: 'Monthly Support Conversations',
    roiDefault: 1200,
    roiMax: 10000,
    roiRatePerHourINR: 750,
    roiRatePerHourUSD: 10
  },
  {
    id: 2,
    slug: 'solo-report',
    name: 'Across SoloReport',
    shortName: 'SoloReport',
    category: 'Consultants & Analytics',
    filterCategory: 'Consultants',
    persona: 'Solo Consultants & Growth Operators',
    tagline: 'Automated multi-source client reporting built for solo consultants.',
    shortDesc: 'Connect data sources, schedule recurring reports, automatically highlight important metric changes, and deliver clean, branded client summaries.',
    detailDesc: 'Solo consultants spend up to 10 hours every month manually copying and pasting numbers from Google Ads, Meta Ads, and GA4 into messy spreadsheets or paying $150/mo for bloated agency suites. SoloReport automates branded summaries with anomaly detection and automated email dispatches.',
    problem: 'Solo consultants and independent operators need a focused, lightweight reporting tool without paying for bloated agency analytics suites.',
    features: [
      'One-click multi-source data connectors (Ads, GA4, Meta)',
      'Automated recurring report schedule (weekly/monthly)',
      'Smart anomaly & sudden metric change highlights',
      'Custom-branded client summaries with agency watermark'
    ],
    competitors: ['AgencyAnalytics', 'Whatagraph', 'Looker Studio', 'DashThis'],
    pricingFutureINR: '₹799–₹1,999',
    pricingFutureUSD: '$12–$25',
    icon: '📊',
    color: '#10B981',
    roiMetric: 'Active Client Accounts',
    roiDefault: 8,
    roiMax: 50,
    roiRatePerHourINR: 900,
    roiRatePerHourUSD: 12
  },
  {
    id: 3,
    slug: 'review-flow',
    name: 'Across ReviewFlow',
    shortName: 'ReviewFlow',
    category: 'Reputation & Local Business',
    filterCategory: 'Reputation',
    persona: 'Clinics, Restaurants & Local Businesses',
    tagline: 'Review consolidation, complaint tracking, and smart response workflows.',
    shortDesc: 'Consolidate customer reviews across platforms, flag negative feedback immediately, draft tailored responses, and track recurring complaints.',
    detailDesc: 'Healthcare clinics, restaurants, and local services live and die by their online reputation. ReviewFlow unifies Google Maps, Practo, Trustpilot, and Facebook reviews into a single smart feed, alerts you to 1-star and 2-star feedback immediately, and auto-generates empathetic, brand-aligned responses.',
    problem: 'Customer reviews often go unanswered and recurring complaints go unnoticed because existing reputation platforms are overpriced for smaller businesses.',
    features: [
      'Unified review inbox across Google Maps, Practo & Trustpilot',
      'Instant negative sentiment alerts via WhatsApp / SMS',
      'AI-assisted empathetic response drafting',
      'Recurring complaint tracking & root cause clustering'
    ],
    competitors: ['Birdeye', 'Podium', 'ReviewTrackers', 'Yext'],
    pricingFutureINR: '₹699–₹1,499',
    pricingFutureUSD: '$10–$20',
    icon: '⭐',
    color: '#F59E0B',
    roiMetric: 'Monthly Incoming Reviews',
    roiDefault: 45,
    roiMax: 500,
    roiRatePerHourINR: 650,
    roiRatePerHourUSD: 8
  },
  {
    id: 4,
    slug: 'commit-track',
    name: 'Across CommitTrack',
    shortName: 'CommitTrack',
    category: 'Productivity & Remote Work',
    filterCategory: 'Execution',
    persona: 'Product Teams & Remote Leaders',
    tagline: 'Turn meeting conversations into tracked decisions and completed commitments.',
    shortDesc: 'Extract concrete decisions from meetings, assign clear owners, set deadlines, track completion status, and automatically flag overdue commitments.',
    detailDesc: 'High-performing teams make dozen of decisions in meetings that get buried in transcript docs or forgotten in Slack. CommitTrack ingests meeting transcripts or voice summaries, identifies explicit commitments, sets deadline reminders, and synchronizes status with your project boards.',
    problem: 'Action items from internal and client meetings get lost in notes, leading to dropped balls, missed deadlines, and lack of accountability.',
    features: [
      'Automated decision & action item extraction from transcripts',
      'Owner & deadline assignment with visual tracking board',
      'Overdue commitment alerts & auto-escalation',
      'One-click summary export for team distribution'
    ],
    competitors: ['Fireflies.ai', 'Fathom', 'Otter.ai', 'Avoma', 'Fellow.app'],
    pricingFutureINR: '₹399–₹1,199',
    pricingFutureUSD: '$6–$18',
    icon: '🎯',
    color: '#EC4899',
    roiMetric: 'Weekly Team Meetings',
    roiDefault: 12,
    roiMax: 60,
    roiRatePerHourINR: 800,
    roiRatePerHourUSD: 10
  },
  {
    id: 5,
    slug: 'invoice-verify',
    name: 'Across InvoiceVerify',
    shortName: 'InvoiceVerify',
    category: 'Finance & Operations',
    filterCategory: 'Finance',
    persona: 'Finance Teams & Accounts Payable',
    tagline: 'Automated supplier invoice extraction, PO matching, and approval routing.',
    shortDesc: 'Capture supplier invoices from email, PDFs, and WhatsApp, extract line-item data, detect duplicates, match against purchase orders, flag discrepancies, and route approvals.',
    detailDesc: 'Accounts payable teams manually key in thousands of supplier bills every month, letting duplicate invoices slip through and paying incorrect line items. InvoiceVerify extracts line items with 99.4% precision, verifies totals against PO records, detects duplicate billing numbers, and routes 1-click approvals.',
    problem: 'Manual invoice data entry and matching is error-prone, slow, and expensive, leading to duplicate payments and compliance risks.',
    features: [
      'Email, PDF & WhatsApp invoice ingestion',
      'Duplicate invoice detection & automatic flagging',
      'Automated 2-way/3-way PO matching with delta alerts',
      'One-click approval routing with audit logs'
    ],
    competitors: ['Tipalti', 'Stampli', 'Nanonets', 'Dext', 'Bill.com'],
    pricingFutureINR: '₹999–₹2,499',
    pricingFutureUSD: '$15–$35',
    icon: '🧾',
    color: '#8B5CF6',
    roiMetric: 'Monthly Supplier Invoices',
    roiDefault: 180,
    roiMax: 2000,
    roiRatePerHourINR: 850,
    roiRatePerHourUSD: 12
  },
  {
    id: 6,
    slug: 'order-hub',
    name: 'Across OrderHub',
    shortName: 'OrderHub',
    category: 'Operations & B2B Commerce',
    filterCategory: 'Operations',
    persona: 'Wholesalers, Distributors & D2C Brands',
    tagline: 'Centralized multi-channel order management, stock visibility, and delivery tracking.',
    shortDesc: 'Unify orders arriving via phone calls, WhatsApp/messages, and field sales reps into one command center with live inventory visibility, payment tracking, and delivery status.',
    detailDesc: 'Growing wholesalers and distributors juggle orders scribbled on paper, WhatsApp chats, and phone calls. OrderHub unifies all incoming order channels into a single live dashboard, prevents overselling with instant stock deductions, tracks payment statuses, and generates dispatch slips in seconds.',
    problem: 'Small distributors and wholesalers lose orders, oversell out-of-stock items, and face delayed dispatches due to disconnected communication channels.',
    features: [
      'Centralized order desk for phone, WhatsApp & rep orders',
      'Real-time stock visibility & low-stock alerts',
      'Payment status tracking & reconciliation',
      'Automated dispatch slip & invoice generation'
    ],
    competitors: ['Zoho Inventory', 'TradeGecko', 'Ordero', 'Cin7', 'Katana'],
    pricingFutureINR: '₹1,499–₹3,499',
    pricingFutureUSD: '$25–$50',
    icon: '📦',
    color: '#14B8A6',
    roiMetric: 'Daily Orders Processed',
    roiDefault: 35,
    roiMax: 500,
    roiRatePerHourINR: 700,
    roiRatePerHourUSD: 9
  },
  {
    id: 7,
    slug: 'ca-docflow',
    name: 'Across CA DocFlow',
    shortName: 'CA DocFlow',
    category: 'Accounting & Professional Practices',
    filterCategory: 'CA & Tax',
    persona: 'Chartered Accountants & Tax Practices',
    tagline: 'Automated client document collection and filing tracker for Chartered Accountants.',
    shortDesc: 'Streamline tax season document collection with structured client portals, automated WhatsApp/email reminders, missing-doc checklists, and filing progress tracking.',
    detailDesc: 'Chartered Accountants and tax practitioners spend hundreds of hours every filing season chasing clients for missing bank statements, 26AS forms, and purchase invoices. CA DocFlow provides branded client checklist portals and sends automated WhatsApp follow-ups until all files are received.',
    problem: 'CA firms waste hundreds of hours chasing clients for missing tax documents, bank statements, and invoices during filing deadlines.',
    features: [
      'Pre-built checklist templates for GST, ITR, Audit & ROC',
      'Automated WhatsApp & Email reminder engine',
      'Client document upload portal (zero password required)',
      'Real-time filing tracker with deadline countdowns'
    ],
    competitors: ['TaxDome', 'Canopy', 'Karbon', 'Content Snare', 'ClientPortal'],
    pricingFutureINR: '₹1,299–₹2,999',
    pricingFutureUSD: '$20–$45',
    icon: '📁',
    color: '#F97316',
    roiMetric: 'Active Tax / Audit Clients',
    roiDefault: 60,
    roiMax: 500,
    roiRatePerHourINR: 950,
    roiRatePerHourUSD: 14
  },
  {
    id: 8,
    slug: 'support-lens',
    name: 'Across SupportLens Manager',
    shortName: 'SupportLens',
    category: 'Customer Support & QA',
    filterCategory: 'Support QA',
    persona: 'Support Directors & QA Leadership',
    tagline: 'High-level support conversation auditing and agent quality reporting for managers.',
    shortDesc: 'Manager-level quality auditing across conversation cohorts, highlighting training opportunities, compliance violations, and sentiment trends.',
    detailDesc: 'Support directors cannot read thousands of tickets manually to evaluate team performance. SupportLens aggregates QA scores across cohorts, surfaces agent coaching opportunities, flags compliance violations, and delivers weekly executive dashboards.',
    problem: 'Support managers lack bird-eye visibility into overall team conversation quality and agent training gaps without expensive enterprise tooling.',
    features: [
      'Multi-channel conversation cohort auditing',
      'Agent coaching cards & training gap identification',
      'Compliance and tone policy violation tracking',
      'Executive quality KPI dashboard & trend reporting'
    ],
    competitors: ['Klaus', 'Playvox', 'Zendesk Explore', 'Scorebuddy'],
    pricingFutureINR: '₹1,499–₹2,999',
    pricingFutureUSD: '$20–$40',
    icon: '🔍',
    color: '#6366F1',
    roiMetric: 'Support Agents on Team',
    roiDefault: 6,
    roiMax: 50,
    roiRatePerHourINR: 900,
    roiRatePerHourUSD: 12
  }
];

export const SANDBOX_PRESETS: Record<string, { input: string; outputHtml: string }> = {
  'converse-qa': {
    input: `Customer [14:22]: Hi, my order #8492 was supposed to arrive yesterday. Can I get a refund or at least an update?
Agent [14:24]: Hello! Let me look into that for you right now.
Agent [14:27]: It looks like there is a slight courier transit delay due to heavy rains.
Customer [14:28]: Okay, but can I get the shipping fee refunded? This is the 3rd time my order was delayed this month.
Agent [14:30]: You should receive it by tomorrow afternoon. Thanks for reaching out! [TICKET CLOSED]`,
    outputHtml: `
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #E2E8F0;padding-bottom:10px;margin-bottom:12px;">
        <span style="font-weight:800;color:#18181B;font-size:14px;">Conversation QA Score</span>
        <span style="background:#FEF3C7;color:#D97706;font-weight:800;padding:4px 10px;border-radius:9999px;font-size:12px;">71% (Needs Coaching)</span>
      </div>
      <div style="display:grid;gap:8px;font-size:12.5px;color:#334155;">
        <div style="background:#FEF2F2;border-left:3px solid #EF4444;padding:8px 10px;border-radius:4px;">
          <strong style="color:#B91C1C;">⚠️ Unanswered Question Detected:</strong><br>
          Customer asked twice for shipping fee refund (14:22 & 14:28). Agent did not acknowledge refund request.
        </div>
        <div style="background:#FFFBEB;border-left:3px solid #F59E0B;padding:8px 10px;border-radius:4px;">
          <strong style="color:#B45309;">⚠️ Repeat Complaint Pattern:</strong><br>
          "3rd time my order was delayed this month" — Flagged for Delivery Operations Review.
        </div>
        <div style="background:#ECFDF5;border-left:3px solid #10B981;padding:8px 10px;border-radius:4px;">
          <strong style="color:#047857;">✓ Tone & Politeness:</strong><br>
          Agent maintained polite language throughout the exchange.
        </div>
      </div>
    `
  },
  'solo-report': {
    input: `Google Ads: 4,820 clicks | 4.2% CTR | $1,240 spend
Google Analytics: 3,940 visits | 228 leads | 5.8% conversion rate
Meta Ads: 890 clicks | $420 spend | 34 leads
Target: Client "Acme Growth Partners" - Weekly Performance Summary`,
    outputHtml: `
      <div style="border-bottom:1px solid #E2E8F0;padding-bottom:10px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:800;font-size:14px;color:#18181B;">Acme Growth Partners — Weekly Brief</span>
          <span style="font-size:11px;background:#ECFDF5;color:#047857;padding:3px 8px;border-radius:9999px;font-weight:700;">Ready to Export PDF</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div style="background:#F8FAFC;padding:8px;border-radius:8px;border:1px solid #E2E8F0;">
          <div style="font-size:10px;color:#64748B;">Total Blended Spend</div>
          <div style="font-size:15px;font-weight:800;color:#18181B;">$1,660.00</div>
        </div>
        <div style="background:#F8FAFC;padding:8px;border-radius:8px;border:1px solid #E2E8F0;">
          <div style="font-size:10px;color:#64748B;">Total Qualified Leads</div>
          <div style="font-size:15px;font-weight:800;color:#10B981;">262 leads (+24%)</div>
        </div>
      </div>
      <div style="background:#F0FDF4;border-left:3px solid #10B981;padding:8px 10px;border-radius:4px;font-size:12px;color:#166534;">
        <strong>🚀 Key Anomaly:</strong> Conversion spike (+24% WoW) driven by new Google Ads landing page test.
      </div>
    `
  },
  'review-flow': {
    input: `Review 1 (⭐⭐): "Waited 45 mins past appointment time without explanation. Doctor was good but front desk was completely disorganized." — Sarah J. (Google)
Review 2 (⭐⭐⭐⭐⭐): "Dr. Sharma is brilliant! Painless procedure and polite staff." — Amit K. (Practo)
Review 3 (⭐⭐⭐): "Clean clinic but billing took 20 minutes to process insurance." — Rajesh M. (Google)`,
    outputHtml: `
      <div style="border-bottom:1px solid #E2E8F0;padding-bottom:10px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:800;font-size:14px;color:#18181B;">Review Audit & Draft Responses</span>
          <span style="font-size:11px;background:#FEE2E2;color:#991B1B;padding:3px 8px;border-radius:9999px;font-weight:700;">1 Urgent Alert</span>
        </div>
      </div>
      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px;margin-bottom:8px;font-size:12px;">
        <div style="font-weight:700;color:#991B1B;margin-bottom:4px;">🚨 Flagged: Sarah J. (2 Stars — Front Desk Delay)</div>
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;padding:8px;border-radius:6px;color:#334155;margin-top:6px;">
          <strong>AI Suggested Response:</strong> "Dear Sarah, thank you for your candid feedback. While we are glad you had a positive experience with the doctor, 45 minutes is completely unacceptable. We have restructured our check-in procedure. Please reach out to clinic@care.com so we can make this right."
        </div>
      </div>
    `
  },
  'commit-track': {
    input: `Meeting: "Product GTM & Pricing Sync" (Oct 28)
Alex: "I will deliver the updated onboarding mockups by Friday 5 PM."
Priya: "I need the pricing spreadsheet from Raj before I can finalize the contract."
Rajesh: "I'll share the sheet today." (Overdue from yesterday)
Alex: "Let's review final numbers Monday morning."`,
    outputHtml: `
      <div style="border-bottom:1px solid #E2E8F0;padding-bottom:10px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:800;font-size:14px;color:#18181B;">Extracted Action Board (4 Items)</span>
          <span style="font-size:11px;background:#FEF3C7;color:#92400E;padding:3px 8px;border-radius:9999px;font-weight:700;">1 Overdue Item</span>
        </div>
      </div>
      <div style="display:grid;gap:6px;font-size:12px;">
        <div style="display:flex;justify-content:space-between;background:#FEF2F2;padding:8px 10px;border-radius:6px;border-left:3px solid #EF4444;">
          <span><strong>Rajesh:</strong> Share pricing spreadsheet with Priya</span>
          <span style="font-weight:700;color:#DC2626;">OVERDUE (Yesterday)</span>
        </div>
        <div style="display:flex;justify-content:space-between;background:#F8FAFC;padding:8px 10px;border-radius:6px;border-left:3px solid #38BDF8;">
          <span><strong>Alex:</strong> Deliver updated onboarding mockups</span>
          <span style="font-weight:700;color:#0284C7;">Due Friday 5 PM</span>
        </div>
        <div style="display:flex;justify-content:space-between;background:#F8FAFC;padding:8px 10px;border-radius:6px;border-left:3px solid #10B981;">
          <span><strong>Priya:</strong> Finalize partner contract</span>
          <span style="color:#64748B;">Blocked by Rajesh</span>
        </div>
      </div>
    `
  },
  'invoice-verify': {
    input: `Incoming PDF Invoice: #INV-2024-884
Vendor: Apex Logistics Ltd
Line Item 1: Express Freight (4 shipments) = ₹32,000
Line Item 2: Fuel Surcharge = ₹4,200
PO Matching: PO-9918 lists Express Freight rate as ₹28,000.
Prior Check: INV-2024-884 submitted 3 days ago by accounts@apex.com.`,
    outputHtml: `
      <div style="border-bottom:1px solid #E2E8F0;padding-bottom:10px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:800;font-size:14px;color:#18181B;">PO Matching & Fraud Audit</span>
          <span style="font-size:11px;background:#FEE2E2;color:#991B1B;padding:3px 8px;border-radius:9999px;font-weight:700;">Approval Blocked</span>
        </div>
      </div>
      <div style="display:grid;gap:6px;font-size:12px;">
        <div style="background:#FEF2F2;border-left:3px solid #DC2626;padding:8px 10px;border-radius:4px;color:#991B1B;">
          <strong>🚨 Duplicate Invoice Detected:</strong> Invoice #INV-2024-884 was already uploaded on Oct 25. Potential double billing.
        </div>
        <div style="background:#FFFBEB;border-left:3px solid #D97706;padding:8px 10px;border-radius:4px;color:#92400E;">
          <strong>⚠️ PO Price Mismatch:</strong> Invoiced Freight ₹32,000 vs PO rate ₹28,000 (+₹4,000 delta).
        </div>
      </div>
    `
  },
  'order-hub': {
    input: `Channel 1 (WhatsApp): "Please send 10 boxes of Model-X to Retailer ABC today"
Channel 2 (Phone Call): Distributor XYZ ordered 8 boxes of Model-X (COD)
Channel 3 (Field Rep): Rep Sunil booked 5 boxes of Model-X
Current Warehouse Stock: 20 boxes in stock.`,
    outputHtml: `
      <div style="border-bottom:1px solid #E2E8F0;padding-bottom:10px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:800;font-size:14px;color:#18181B;">Multi-Channel Stock Reconciliation</span>
          <span style="font-size:11px;background:#FEE2E2;color:#991B1B;padding:3px 8px;border-radius:9999px;font-weight:700;">Stock Deficit -3</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;font-size:12px;">
        <div style="background:#F8FAFC;padding:8px;border-radius:6px;border:1px solid #E2E8F0;">
          <div style="font-size:10px;color:#64748B;">Orders Requested</div>
          <div style="font-weight:800;font-size:14px;">23 boxes</div>
        </div>
        <div style="background:#F8FAFC;padding:8px;border-radius:6px;border:1px solid #E2E8F0;">
          <div style="font-size:10px;color:#64748B;">Physical Stock</div>
          <div style="font-weight:800;font-size:14px;">20 boxes</div>
        </div>
        <div style="background:#FEF2F2;padding:8px;border-radius:6px;border:1px solid #FECACA;">
          <div style="font-size:10px;color:#B91C1C;">Shortfall</div>
          <div style="font-weight:800;font-size:14px;color:#DC2626;">-3 boxes</div>
        </div>
      </div>
      <div style="background:#EFF6FF;border-left:3px solid #2563EB;padding:8px 10px;border-radius:4px;font-size:12px;color:#1E40AF;">
        <strong>Recommended Action:</strong> Allocate 10 to ABC, 8 to XYZ, place 3 on backorder for Sunil.
      </div>
    `
  },
  'ca-docflow': {
    input: `Client: "Apex Healthcare Pvt Ltd" — GST Filing Q3
Checklist: 1. GSTR-2B Recon | 2. Purchase Invoices Oct | 3. HDFC Bank Statement | 4. Form 26AS
Current Status: Bank Statement missing (3 follow-ups sent)
Due Date: In 4 days`,
    outputHtml: `
      <div style="border-bottom:1px solid #E2E8F0;padding-bottom:10px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:800;font-size:14px;color:#18181B;">Filing Status: Apex Healthcare</span>
          <span style="font-size:11px;background:#FEE2E2;color:#991B1B;padding:3px 8px;border-radius:9999px;font-weight:700;">Deadline in 4 Days</span>
        </div>
      </div>
      <div style="display:grid;gap:6px;font-size:12px;margin-bottom:8px;">
        <div style="background:#ECFDF5;padding:6px 10px;border-radius:4px;color:#047857;">✓ GSTR-2B Recon (Uploaded & Verified)</div>
        <div style="background:#ECFDF5;padding:6px 10px;border-radius:4px;color:#047857;">✓ Oct Purchase Invoices (Verified)</div>
        <div style="background:#FEF2F2;padding:6px 10px;border-radius:4px;color:#B91C1C;font-weight:700;">✕ HDFC Bank Statement Q3 (MISSING — Blocked)</div>
      </div>
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;padding:8px 10px;border-radius:6px;font-size:11.5px;color:#166534;">
        <strong>Automated Action:</strong> Scheduled WhatsApp reminder with 1-click magic upload link queued for 10:00 AM tomorrow.
      </div>
    `
  },
  'support-lens': {
    input: `Agent Cohort: Team Alpha (6 agents, 420 tickets audited)
Compliance Flag: 8 tickets missing required refund disclaimer
Empathy Score: 88% average across team
Agent Deep-Dive: Agent "Rohan S." has 32% unanswered question rate.`,
    outputHtml: `
      <div style="border-bottom:1px solid #E2E8F0;padding-bottom:10px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:800;font-size:14px;color:#18181B;">Cohort QA Audit: Team Alpha</span>
          <span style="font-size:11px;background:#ECFDF5;color:#047857;padding:3px 8px;border-radius:9999px;font-weight:700;">88% Cohort Health</span>
        </div>
      </div>
      <div style="display:grid;gap:8px;font-size:12px;">
        <div style="background:#FFFBEB;border-left:3px solid #F59E0B;padding:8px 10px;border-radius:4px;color:#92400E;">
          <strong>Target Coaching: Rohan S.</strong><br>
          Unanswered question rate is 32% (team baseline is 4%). Recommended training module: Active Reading & Ticket Checklists.
        </div>
        <div style="background:#F8FAFC;border-left:3px solid #6366F1;padding:8px 10px;border-radius:4px;color:#334155;">
          <strong>Compliance Check:</strong> 8 tickets flagged for missing refund terms disclaimer. Auto-macro update pushed to Zendesk.
        </div>
      </div>
    `
  }
};

