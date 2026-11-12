export type Currency = 'INR' | 'USD';

export interface SaaSTool {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  filterCategory: string;
  persona: string;
  tagline: string;
  shortDesc: string;
  detailDesc: string;
  problem: string;
  features: string[];
  competitors: string[];
  pricingFutureINR: string;
  pricingFutureUSD: string;
  icon: string;
  color: string;
  roiMetric: string;
  roiDefault: number;
  roiMax: number;
  roiRatePerHourINR: number;
  roiRatePerHourUSD: number;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  role: string;
  code?: string;
  toolSlug: string;
  queueNumber: number;
  createdAt: string;
}

export interface AnalyticsData {
  pageVisits: number;
  toolClicks: Record<string, number>;
  sandboxRuns: Record<string, number>;
  waitlistCount: number;
  waitlistSignups: WaitlistEntry[];
}

export interface SaasOnDemandRequest {
  id: string;
  category: string;
  toolNameIdea: string;
  description: string;
  currentWorkaround?: string;
  targetUsers?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  instagram?: string;
  createdAt: string;
}


