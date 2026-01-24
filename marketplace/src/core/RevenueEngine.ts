// @dndhub/marketplace/src/core/index.ts

/**
 * @dndhub/marketplace - Core Implementation
 * 
 * Production-ready marketplace engine with runtime enforcement
 * Industry-aligned with AWS Marketplace, Stripe, GitHub Marketplace
 */
import type {
  MarketplacePublisher,
  RevenueTransaction
} from '../types/index.js';

// ============================================================================
// REVENUE SHARING ENGINE
// ============================================================================

export class RevenueEngine {
  /**
   * Calculate publisher revenue from transaction
   */
  static calculatePublisherRevenue(
    publisher: MarketplacePublisher,
    transactionAmount: number,
    currency: string
  ): {
    platformFee: number;
    publisherRevenue: number;
    transaction: Omit<RevenueTransaction, 'id' | 'timestamp'>;
  } {
    const platformFee = transactionAmount * (1 - publisher.revenueShare);
    const publisherRevenue = transactionAmount * publisher.revenueShare;

    return {
      platformFee,
      publisherRevenue,
      transaction: {
        productId: '' as string, // Set by caller
        publisherId: publisher.id,
        amount: transactionAmount,
        currency,
        platformFee,
        publisherRevenue,
        metadata: {}
      }
    };
  }

  /**
   * Calculate marketplace commission
   */
  static calculateMarketplaceFee(
    transactionAmount: number,
    publisherShare: number = 0.80 // Default 80% to publisher
  ): number {
    return transactionAmount * (1 - publisherShare);
  }
}