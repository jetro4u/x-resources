// @dndhub/marketplace/src/core/index.ts

/**
 * @dndhub/marketplace - Core Implementation
 * 
 * Production-ready marketplace engine with runtime enforcement
 * Industry-aligned with AWS Marketplace, Stripe, GitHub Marketplace
 */
import type { Subscription } from '../types/index.js';

// ============================================================================
// SUBSCRIPTION MANAGER
// ============================================================================

export class SubscriptionManager {
  /**
   * Check if subscription is active
   */
  static isActive(subscription: Subscription): boolean {
    return subscription.status === 'active' || subscription.status === 'trialing';
  }

  /**
   * Check if subscription is in trial
   */
  static isInTrial(subscription: Subscription): boolean {
    if (!subscription.trialEnd) return false;
    return subscription.status === 'trialing' && new Date() < subscription.trialEnd;
  }

  /**
   * Get days until expiry
   */
  static getDaysUntilExpiry(subscription: Subscription): number {
    const now = new Date();
    const expiryDate = subscription.currentPeriodEnd;
    const diffMs = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if subscription needs renewal soon
   */
  static needsRenewal(subscription: Subscription, daysThreshold: number = 7): boolean {
    return this.isActive(subscription) && this.getDaysUntilExpiry(subscription) <= daysThreshold;
  }
}