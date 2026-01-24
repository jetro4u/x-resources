// @dndhub/marketplace/src/core/index.ts

/**
 * @dndhub/marketplace - Core Implementation
 * 
 * Production-ready marketplace engine with runtime enforcement
 * Industry-aligned with AWS Marketplace, Stripe, GitHub Marketplace
 */
import type {
  PricingConfiguration,
  TierCapabilities,
  PricingTier
} from '../types/index.js';

// ============================================================================
// TIER RESOLVER
// ============================================================================

export class TierResolver {
  /**
   * Get tier capabilities from configuration
   */
  static getCapabilities(
    config: PricingConfiguration,
    tier: PricingTier
  ): TierCapabilities | null {
    const model = config.tiers[tier];
    return model?.capabilities || null;
  }

  /**
   * Check if tier allows addons
   */
  static canUseAddons(
    config: PricingConfiguration,
    tier: PricingTier,
    addonIds: readonly string[]
  ): { allowed: boolean; incompatible: readonly string[] } {
    const incompatible: string[] = [];

    for (const addonId of addonIds) {
      const addon = Object.values(config.addons || {}).find(a => 
        'compatibleTiers' in a && a.compatibleTiers.includes(tier)
      );
      
      if (!addon) {
        incompatible.push(addonId);
      }
    }

    return {
      allowed: incompatible.length === 0,
      incompatible
    };
  }
}