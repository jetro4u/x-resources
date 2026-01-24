// @dndhub/marketplace/src/core/index.ts

/**
 * @dndhub/marketplace - Core Implementation
 * 
 * Production-ready marketplace engine with runtime enforcement
 * Industry-aligned with AWS Marketplace, Stripe, GitHub Marketplace
 */
import type { Entitlement } from '../types/index.js';

// ============================================================================
// USAGE METER
// ============================================================================

export class UsageMeter {
  /**
   * Increment usage counter
   */
  static increment(
    entitlement: Entitlement,
    metricKey: string,
    amount: number = 1
  ): Entitlement {
    const current = entitlement.usage.current[metricKey] || 0;

    return {
      ...entitlement,
      usage: {
        ...entitlement.usage,
        current: {
          ...entitlement.usage.current,
          [metricKey]: current + amount
        }
      }
    };
  }

  /**
   * Reset usage for billing period
   */
  static reset(
    entitlement: Entitlement,
    metricsToReset?: readonly string[]
  ): Entitlement {
    const newCurrent = { ...entitlement.usage.current };

    if (metricsToReset) {
      for (const metric of metricsToReset) {
        newCurrent[metric] = 0;
      }
    } else {
      // Reset all
      Object.keys(newCurrent).forEach(key => {
        newCurrent[key] = 0;
      });
    }

    return {
      ...entitlement,
      usage: {
        ...entitlement.usage,
        current: newCurrent,
        resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
      }
    };
  }

  /**
   * Get usage percentage
   */
  static getUsagePercentage(
    entitlement: Entitlement,
    metricKey: string
  ): number {
    const current = entitlement.usage.current[metricKey] || 0;
    const limit = entitlement.usage.limits[metricKey];

    if (typeof limit !== 'number' || limit === 0) return 0;
    return (current / limit) * 100;
  }
}