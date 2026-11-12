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

export type VipCodeStatus = 'Unused' | 'Used' | 'Expired' | 'Revoked';

export interface VipCodeRecord {
  id: string;
  codeMasked: string;
  codeHash: string;
  toolSlug: string;
  toolName: string;
  status: VipCodeStatus;
  createdAt: string;
  expiresAt: string;
  redeemedAt?: string | null;
  revokedAt?: string | null;
  waitlistId?: string | null;
  waitlistContact?: string | null;
}

export interface WaitlistEntry {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  preferredContact?: 'email' | 'phone' | 'instagram';
  role: string;
  code?: string;
  vipCodeMasked?: string;
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


