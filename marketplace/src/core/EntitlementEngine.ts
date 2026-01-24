// @dndhub/marketplace/src/core/index.ts

/**
 * @dndhub/marketplace - Core Implementation
 * 
 * Production-ready marketplace engine with runtime enforcement
 * Industry-aligned with AWS Marketplace, Stripe, GitHub Marketplace
 */
import type { Entitlement } from '../types/index.js';

// ============================================================================
// ENTITLEMENT ENGINE (Runtime Enforcement)
// ============================================================================

/**
 * Result types for entitlement checks
 */
export type EntitlementResult =
  | { permitted: true }
  | { permitted: false; code: 'FEATURE_LOCKED' | 'LIMIT_EXCEEDED' | 'SUBSCRIPTION_EXPIRED' | 'TRIAL_ENDED'; message: string };

/**
 * Core entitlement engine - used by Fluxr, Authority, Fast
 */
export class EntitlementEngine {
  /**
   * Check if a feature is accessible
   */
  static checkFeatureAccess(
    entitlement: Entitlement,
    featureId: string
  ): EntitlementResult {
    const { capabilities } = entitlement;

    // Check if feature is included
    if (capabilities.features.included.includes(featureId)) {
      return { permitted: true };
    }

    // Check if explicitly locked
    if (capabilities.features.locked?.includes(featureId)) {
      return {
        permitted: false,
        code: 'FEATURE_LOCKED',
        message: `Feature '${featureId}' is not available in your tier`
      };
    }

    return {
      permitted: false,
      code: 'FEATURE_LOCKED',
      message: `Feature '${featureId}' requires an upgrade`
    };
  }

  /**
   * Check if a quantitative limit allows action
   */
  static checkLimit(
    entitlement: Entitlement,
    limitKey: string,
    requestedAmount: number = 1
  ): EntitlementResult {
    const limit = entitlement.capabilities.limits[limitKey as keyof typeof entitlement.capabilities.limits];
    const current = entitlement.usage.current[limitKey] || 0;

    if (typeof limit === 'number') {
      if (current + requestedAmount > limit) {
        return {
          permitted: false,
          code: 'LIMIT_EXCEEDED',
          message: `${limitKey} limit exceeded: ${current}/${limit}`
        };
      }
    }

    return { permitted: true };
  }

  /**
   * Check boolean capability
   */
  static checkCapability(
    entitlement: Entitlement,
    capabilityKey: string
  ): EntitlementResult {
    const value = entitlement.capabilities.limits[capabilityKey as keyof typeof entitlement.capabilities.limits];

    if (typeof value === 'boolean' && !value) {
      return {
        permitted: false,
        code: 'FEATURE_LOCKED',
        message: `${capabilityKey} requires an upgrade`
      };
    }

    return { permitted: true };
  }

  /**
   * Check if subscription is valid
   */
  static checkSubscriptionValidity(entitlement: Entitlement): EntitlementResult {
    const now = new Date();

    if (entitlement.validUntil < now) {
      return {
        permitted: false,
        code: 'SUBSCRIPTION_EXPIRED',
        message: 'Subscription has expired'
      };
    }

    return { permitted: true };
  }

  /**
   * Comprehensive access check
   */
  static checkAccess(
    entitlement: Entitlement,
    action: {
      featureId?: string;
      limitKey?: string;
      requestedAmount?: number;
      capabilityKey?: string;
    }
  ): EntitlementResult {
    // Check subscription validity first
    const validityCheck = this.checkSubscriptionValidity(entitlement);
    if (!validityCheck.permitted) return validityCheck;

    // Check feature access
    if (action.featureId) {
      const featureCheck = this.checkFeatureAccess(entitlement, action.featureId);
      if (!featureCheck.permitted) return featureCheck;
    }

    // Check quantitative limits
    if (action.limitKey) {
      const limitCheck = this.checkLimit(entitlement, action.limitKey, action.requestedAmount);
      if (!limitCheck.permitted) return limitCheck;
    }

    // Check boolean capabilities
    if (action.capabilityKey) {
      const capabilityCheck = this.checkCapability(entitlement, action.capabilityKey);
      if (!capabilityCheck.permitted) return capabilityCheck;
    }

    return { permitted: true };
  }
}