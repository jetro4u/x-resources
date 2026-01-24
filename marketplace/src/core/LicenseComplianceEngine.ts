// @dndhub/marketplace/src/core/index.ts

/**
 * @dndhub/marketplace - Core Implementation
 * 
 * Production-ready marketplace engine with runtime enforcement
 * Industry-aligned with AWS Marketplace, Stripe, GitHub Marketplace
 */
import type { LicenseModel } from '../types/index.js';

// ============================================================================
// LICENSE COMPLIANCE CHECKER
// ============================================================================

export interface LicenseComplianceContext {
  readonly resale: boolean;
  readonly attribution: boolean;
  readonly commercialUse: boolean;
  readonly modification: boolean;
  readonly distribution: boolean;
}

export class LicenseComplianceEngine {
  /**
   * Check if usage complies with license
   */
  static checkCompliance(
    license: LicenseModel,
    context: LicenseComplianceContext
  ): { compliant: boolean; violations: string[] } {
    const violations: string[] = [];

    // Check restrictions
    if (license.restrictions) {
      for (const restriction of license.restrictions) {
        if (restriction.includes('No resale') && context.resale) {
          violations.push('Resale is not permitted under this license');
        }
        if (restriction.includes('Attribution required') && !context.attribution) {
          violations.push('Attribution is required but not provided');
        }
        if (restriction.includes('Non-commercial') && context.commercialUse) {
          violations.push('Commercial use is not permitted');
        }
        if (restriction.includes('No modification') && context.modification) {
          violations.push('Modification is not permitted');
        }
      }
    }

    return {
      compliant: violations.length === 0,
      violations
    };
  }
}