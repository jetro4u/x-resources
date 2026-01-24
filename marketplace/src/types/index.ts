// @dndhub/marketplace/src/types/index.ts

/**
 * @dndhub/marketplace - Core Types
 * 
 * Industry-aligned marketplace types for DNDHUB ecosystem
 * Supports: Fluxr, SynAI, Fast, DataOrb, Trakfox, GEOCoLab
 * 
 * Design Principles:
 * - Orthogonal dimensions (tier, charge, billing, license)
 * - Runtime enforceable
 * - Type-safe discriminated unions
 * - Multi-sided marketplace support
 */

// ============================================================================
// PUBLISHER MODEL
// ============================================================================

export interface MarketplacePublisher {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly website?: string;
  readonly verified: boolean;
  readonly rating: number; // 0.0 - 5.0
  readonly totalInstalls: number;
  readonly revenueShare: number; // 0.0 - 1.0 (e.g., 0.80 for 80%)
  readonly payoutMethod: 'stripe' | 'paypal' | 'bank_transfer';
  readonly createdAt: Date;
  readonly metadata: Record<string, unknown>;
}

// ============================================================================
// PRODUCT MODEL
// ============================================================================

export type ProductCategory =
  | 'library'
  | 'service'
  | 'adapter'
  | 'plugin'
  | 'dataset'
  | 'model'
  | 'template'
  | 'workflow';

export interface MarketplaceProduct {
  readonly id: string;
  readonly installUrl?: string;
  readonly category: ProductCategory;
  readonly name: string;
  readonly description: string;
  readonly version: string; // SemVer
  readonly certified: boolean;
  publisher: {
    publisherId: string;
    rating: number;
  };
  readonly pricing: PricingConfiguration;
  readonly license: LicenseModel;
  readonly dependencies?: readonly string[];
  readonly tags: readonly string[];
  readonly metadata: Record<string, unknown>;
}

// ============================================================================
// PRICING DIMENSIONS (Orthogonal)
// ============================================================================

/**
 * DIMENSION 1: Pricing Tier (WHO is this for?)
 * Defines capability levels, not billing mechanics
 */
export type PricingTier =
  | 'community'   // Free, OSS, evaluation
  | 'pro'    // Individual developers
  | 'premium'         // Teams & production
  | 'enterprise'  // Large orgs, SLA
  | 'addon';      // Feature extensions

/**
 * DIMENSION 2: Charge Model (WHAT is being charged?)
 * Defines what is monetized
 */
export type ChargeModel =
  | 'none'          // Free
  | 'flat'          // Fixed price
  | 'per_seat'      // Per user
  | 'usage'         // Metered consumption
  | 'tiered_usage'  // Graduated pricing
  | 'feature'       // Feature-gated
  | 'contract'      // Negotiated
  | 'hybrid';       // Combination

/**
 * DIMENSION 3: Billing Model (HOW money flows?)
 * Defines payment mechanics
 */
export type BillingModel =
  | 'one_time'      // Lifetime license
  | 'subscription'  // Monthly/yearly
  | 'pay_as_you_go' // Usage billing
  | 'invoice'       // Enterprise
  | 'prepaid';      // Credits

/**
 * DIMENSION 4: License Model (Legal rights)
 * Defines legal usage rights
 */
export interface LicenseModel {
  readonly type: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'Commercial' | 'Custom';
  readonly url?: string;
  readonly attribution?: string;
  readonly restrictions?: readonly string[];
  readonly customTerms?: string;
}

// ============================================================================
// TIER CAPABILITIES & LIMITS
// ============================================================================

/**
 * Defines runtime-enforceable capabilities and limits
 * These are NOT documentation - they drive access control
 */
export interface TierCapabilities {
  readonly features: {
    readonly included: readonly string[];  // Feature flags
    readonly locked?: readonly string[];   // Explicitly disabled
  };
  readonly limits: {
    // Quantitative limits
    readonly apiCalls?: number;
    readonly storageGB?: number;
    readonly seats?: number;
    readonly projects?: number;
    readonly computeUnits?: number;
    readonly tokensPerMonth?: number;
    // Boolean capabilities
    readonly customDomains?: boolean;
    readonly ssoIntegration?: boolean;
    readonly prioritySupport?: boolean;
    readonly advancedAnalytics?: boolean;
    readonly whiteLabel?: boolean;
  };
  readonly trial?: {
    readonly duration: number;
    readonly unit: 'days' | 'months';
    readonly limitedFeatures?: readonly string[];
  };
}

// ============================================================================
// USAGE METERING
// ============================================================================

export interface UsageMetric {
  readonly metric: string;        // e.g., "api_calls", "tokens", "storage_gb"
  readonly unit: string;          // e.g., "call", "token", "GB"
  readonly displayName: string;   // Human-readable
  readonly resetInterval: 'hourly' | 'daily' | 'monthly' | 'never';
}

export interface UsageTier {
  readonly from: number;
  readonly to?: number;           // undefined = infinity
  readonly pricePerUnit: number;
  readonly currency: string;
}

export interface UsagePricing {
  readonly metric: UsageMetric;
  readonly tiers: readonly UsageTier[];
  readonly freeAllowance?: number;
  readonly overage?: {
    readonly rate: number;
    readonly cap?: number;        // Max overage charges
  };
}

// ============================================================================
// PRICING MODELS (Discriminated Unions)
// ============================================================================

/**
 * Base pricing model shared across all paid tiers
 */
interface BasePricingModel {
  readonly tier: PricingTier;
  readonly capabilities: TierCapabilities;
  readonly currency: string;
}

/**
 * Free/Community Tier
 */
export interface FreePricingModel extends BasePricingModel {
  readonly chargeModel: 'none';
  readonly tier: 'community';
}

/**
 * Flat Subscription (Standard/Pro common pattern)
 */
export interface FlatSubscriptionModel extends BasePricingModel {
  readonly chargeModel: 'flat';
  readonly billingModel: 'subscription';
  readonly priceMonthly: number;
  readonly priceYearly?: number;  // With discount
  readonly interval: 'monthly' | 'yearly';
}

/**
 * Per-Seat Model (Team/Enterprise)
 */
export interface PerSeatModel extends BasePricingModel {
  readonly chargeModel: 'per_seat';
  readonly billingModel: 'subscription';
  readonly pricePerSeat: number;
  readonly interval: 'monthly' | 'yearly';
  readonly seats: {
    readonly min: number;
    readonly max?: number;
  };
}

/**
 * Usage-Based Model (Metered consumption)
 */
export interface UsageBasedModel extends BasePricingModel {
  readonly chargeModel: 'usage' | 'tiered_usage';
  readonly billingModel: 'pay_as_you_go';
  readonly usage: UsagePricing;
}

/**
 * Hybrid Model (Subscription + Usage)
 */
export interface HybridModel extends BasePricingModel {
  readonly chargeModel: 'hybrid';
  readonly billingModel: 'subscription';
  readonly baseSubscription: Omit<FlatSubscriptionModel, 'tier' | 'capabilities' | 'currency'>;
  readonly usage: readonly UsagePricing[];
}

/**
 * Enterprise Contract (Custom negotiated)
 */
export interface EnterpriseContractModel extends BasePricingModel {
  readonly chargeModel: 'contract';
  readonly billingModel: 'invoice';
  readonly tier: 'enterprise';
  readonly contract: {
    readonly minCommitmentUSD: number;
    readonly termMonths: number;
    readonly sla?: string;          // e.g., "99.99%"
    readonly supportLevel: 'standard' | 'premium' | 'dedicated';
    readonly customTerms?: string;
  };
}

/**
 * Add-on Model (Feature extensions)
 */
export interface AddonModel extends BasePricingModel {
  readonly chargeModel: 'feature';
  readonly billingModel: 'one_time' | 'subscription';
  readonly tier: 'addon';
  readonly price: number;
  readonly interval?: 'monthly' | 'yearly';
  readonly compatibleTiers: readonly PricingTier[];
  readonly dependencies?: readonly string[]; // Required addons
}

/**
 * Complete Pricing Model (Discriminated Union)
 */
export type PricingModel =
  | FreePricingModel
  | FlatSubscriptionModel
  | PerSeatModel
  | UsageBasedModel
  | HybridModel
  | EnterpriseContractModel
  | AddonModel;

// ============================================================================
// PRICING CONFIGURATION
// ============================================================================

export interface PricingConfiguration {
  readonly defaultTier: PricingTier;
  readonly tiers: Record<PricingTier, PricingModel>;
  readonly addons?: Record<string, AddonModel>;
  readonly supportedCurrencies: readonly string[];
  readonly globalLicense: LicenseModel;
}

// ============================================================================
// SUBSCRIPTION & ENTITLEMENT
// ============================================================================

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'expired';

export interface Subscription {
  readonly id: string;
  readonly productId: string;
  readonly userId: string;
  readonly organizatiostring?: string;
  readonly tier: PricingTier;
  readonly status: SubscriptionStatus;
  readonly currentPeriodStart: Date;
  readonly currentPeriodEnd: Date;
  readonly canceledAt?: Date;
  readonly trialEnd?: Date;
  readonly addons: readonly string[];
  readonly metadata: Record<string, unknown>;
}

export interface Entitlement {
  readonly userId: string;
  readonly productId: string;
  readonly capabilities: TierCapabilities;
  readonly usage: {
    readonly current: Record<string, number>;
    readonly limits: Record<string, number>;
    readonly resetAt: Date;
  };
  readonly validUntil: Date;
}

// ============================================================================
// REVENUE SHARING
// ============================================================================

export interface RevenueTransaction {
  readonly id: string;
  readonly productId: string;
  readonly publisherId: string;
  readonly amount: number;
  readonly currency: string;
  readonly platformFee: number;
  readonly publisherRevenue: number;
  readonly timestamp: Date;
  readonly metadata: Record<string, unknown>;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isFreePricing(model: PricingModel): model is FreePricingModel {
  return model.chargeModel === 'none';
}

export function isFlatSubscription(model: PricingModel): model is FlatSubscriptionModel {
  return model.chargeModel === 'flat' && 'billingModel' in model && model.billingModel === 'subscription';
}

export function isPerSeat(model: PricingModel): model is PerSeatModel {
  return model.chargeModel === 'per_seat';
}

export function isUsageBased(model: PricingModel): model is UsageBasedModel {
  return model.chargeModel === 'usage' || model.chargeModel === 'tiered_usage';
}

export function isHybrid(model: PricingModel): model is HybridModel {
  return model.chargeModel === 'hybrid';
}

export function isEnterprise(model: PricingModel): model is EnterpriseContractModel {
  return model.tier === 'enterprise' && model.chargeModel === 'contract';
}

export function isAddon(model: PricingModel): model is AddonModel {
  return model.tier === 'addon';
}