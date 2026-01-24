# @dndhub/marketplace

**Production-ready marketplace engine for the DNDHUB ecosystem**

Comprehensive business model and pricing system built on industry best practices from AWS Marketplace, Stripe, GitHub Marketplace, Vercel, and Atlassian.

## Overview

`@dndhub/marketplace` provides:

- **Type-safe pricing models** with discriminated unions
- **Runtime entitlement enforcement** for Fluxr, SynAI, Authority
- **Usage metering and billing** with tiered pricing
- **Revenue sharing** for publishers
- **License compliance** checking
- **Subscription management** with trials and renewals

## Architecture

### Orthogonal Pricing Dimensions

The library separates four independent concerns:

1. **Pricing Tier** (WHO) - community, standard, pro, enterprise, addon
2. **Charge Model** (WHAT) - none, flat, per_seat, usage, hybrid, contract
3. **Billing Model** (HOW) - one_time, subscription, pay_as_you_go, invoice
4. **License Model** (LEGAL) - MIT, Apache, Commercial, etc.

This prevents common anti-patterns like conflating "free" with "tier".

## Installation

```bash
npm install @dndhub/marketplace
# or
yarn add @dndhub/marketplace
```

## Core Concepts

### 1. Pricing Models

```typescript
import type { PricingModel } from '@dndhub/marketplace';

// Free tier
const freeTier: PricingModel = {
  tier: 'community',
  chargeModel: 'none',
  capabilities: {
    features: { included: ['basic_api'] },
    limits: { apiCalls: 5000 }
  },
  currency: 'USD'
};

// Flat subscription
const standardTier: PricingModel = {
  tier: 'standard',
  chargeModel: 'flat',
  billingModel: 'subscription',
  priceMonthly: 29,
  priceYearly: 290,
  interval: 'monthly',
  capabilities: {
    features: { included: ['api_access', 'analytics'] },
    limits: { apiCalls: 100000 }
  },
  currency: 'USD'
};

// Hybrid (subscription + usage)
const proTier: PricingModel = {
  tier: 'pro',
  chargeModel: 'hybrid',
  billingModel: 'subscription',
  baseSubscription: {
    chargeModel: 'flat',
    billingModel: 'subscription',
    priceMonthly: 99,
    interval: 'monthly'
  },
  usage: [{
    metric: {
      metric: 'api_calls',
      unit: 'call',
      displayName: 'API Calls',
      resetInterval: 'monthly'
    },
    tiers: [
      { from: 0, to: 1000000, pricePerUnit: 0, currency: 'USD' },
      { from: 1000000, pricePerUnit: 0.0001, currency: 'USD' }
    ],
    freeAllowance: 1000000
  }],
  capabilities: {
    features: { included: ['everything'] },
    limits: { apiCalls: Infinity }
  },
  currency: 'USD'
};
```

### 2. Entitlement Enforcement

**For Fluxr Query Execution:**

```typescript
import { EntitlementEngine } from '@dndhub/marketplace';

// Before executing expensive query
const canExecute = EntitlementEngine.checkAccess(userEntitlement, {
  featureId: 'advanced_queries',
  limitKey: 'apiCalls',
  requestedAmount: 1
});

if (!canExecute.permitted) {
  throw new Error(canExecute.message);
}

// Execute query
const result = await fluxrAdapter.query(sql);

// Increment usage
userEntitlement = UsageMeter.increment(userEntitlement, 'apiCalls', 1);
```

**For SynAI Component Generation:**

```typescript
import { EntitlementEngine } from '@dndhub/marketplace';

// Check AI generation capability
const canGenerate = EntitlementEngine.checkCapability(
  userEntitlement,
  'ai_generation'
);

if (!canGenerate.permitted) {
  return { error: 'AI generation requires Pro tier' };
}

// Check token limits
const tokenCheck = EntitlementEngine.checkLimit(
  userEntitlement,
  'aiTokens',
  estimatedTokens
);

if (!tokenCheck.permitted) {
  return { error: 'Token limit exceeded' };
}
```

**For Authority Access Control:**

```typescript
import { EntitlementEngine } from '@dndhub/marketplace';

// Check feature access
const hasFeature = EntitlementEngine.checkFeatureAccess(
  userEntitlement,
  'sso_integration'
);

if (!hasFeature.permitted) {
  return { error: 'SSO requires Enterprise tier' };
}
```

### 3. Pricing Calculation

```typescript
import { PricingCalculator } from '@dndhub/marketplace';

// Calculate monthly cost
const breakdown = PricingCalculator.calculate(proTierModel, {
  seats: 10,
  usage: { api_calls: 2500000 }, // 2.5M calls
  interval: 'monthly',
  addons: ['ml-adapter']
});

console.log(breakdown);
// {
//   basePrice: 99,
//   seatCharges: 0,
//   usageCharges: 150, // (2.5M - 1M free) * 0.0001
//   addonCharges: 50,
//   subtotal: 299,
//   total: 299,
//   currency: 'USD',
//   breakdown: { ... }
// }
```

### 4. Revenue Sharing

```typescript
import { RevenueEngine } from '@dndhub/marketplace';

const publisher: MarketplacePublisher = {
  id: 'pub_123' as NID,
  name: 'Acme Corp',
  revenueShare: 0.80, // 80% to publisher
  // ...
};

const revenue = RevenueEngine.calculatePublisherRevenue(
  publisher,
  299, // Transaction amount
  'USD'
);

console.log(revenue);
// {
//   platformFee: 59.80,  // 20%
//   publisherRevenue: 239.20  // 80%
// }
```

### 5. License Compliance

```typescript
import { LicenseComplianceEngine } from '@dndhub/marketplace';

const license: LicenseModel = {
  type: 'Commercial',
  restrictions: ['No resale', 'Attribution required']
};

const compliance = LicenseComplianceEngine.checkCompliance(license, {
  resale: true,
  attribution: false,
  commercialUse: true,
  modification: false,
  distribution: false
});

if (!compliance.compliant) {
  console.error('License violations:', compliance.violations);
  // ['Resale is not permitted', 'Attribution is required but not provided']
}
```

## Integration Examples

### Fluxr Adapter Integration

```typescript
// In @fluxr/adaptr
import { EntitlementEngine, UsageMeter } from '@dndhub/marketplace';

class FluxrAdapter {
  async executeQuery(query: string, entitlement: Entitlement) {
    // Check entitlement
    const check = EntitlementEngine.checkAccess(entitlement, {
      featureId: 'database_queries',
      limitKey: 'apiCalls',
      requestedAmount: 1
    });

    if (!check.permitted) {
      throw new FluxrError(check.code, check.message);
    }

    // Execute
    const result = await this.db.query(query);

    // Meter usage
    await this.meterUsage(entitlement.userId, 'apiCalls', 1);

    return result;
  }
}
```

### SynAI Component Access

```typescript
// In @synai/core
import { EntitlementEngine } from '@dndhub/marketplace';

class SynaiRenderer {
  canUseComponent(componentId: string, entitlement: Entitlement): boolean {
    const componentTier = this.getComponentTier(componentId);

    if (componentTier === 'pro' || componentTier === 'enterprise') {
      const check = EntitlementEngine.checkFeatureAccess(
        entitlement,
        `component_${componentId}`
      );
      return check.permitted;
    }

    return true; // Community components always available
  }
}
```

### Authority Rule Integration

```typescript
// In @dndhub/authority
import { EntitlementEngine } from '@dndhub/marketplace';

class AuthorityEngine {
  evaluateRule(rule: Rule, context: Context): boolean {
    // Check marketplace entitlement first
    if (rule.requiresFeature) {
      const entitlement = this.getEntitlement(context.userId);
      const check = EntitlementEngine.checkFeatureAccess(
        entitlement,
        rule.requiresFeature
      );

      if (!check.permitted) {
        return false;
      }
    }

    // Proceed with normal rule evaluation
    return this.evaluate(rule, context);
  }
}
```

## Preset Configurations

The library includes production-ready configurations:

```typescript
import {
  fluxrPricingConfig,
  synaiPricingConfig,
  geocolabPricingConfig
} from '@dndhub/marketplace/configs';

// Use directly
const fluxrTier = fluxrPricingConfig.tiers.standard;
console.log(fluxrTier.priceMonthly); // 29
```

## Business Model Summary

### Revenue Streams

1. **Subscriptions** - Recurring monthly/yearly plans (70% of revenue)
2. **Usage-Based** - Metered consumption (20% growth opportunity)
3. **Marketplace Fees** - 20% platform cut on publisher sales
4. **Enterprise Contracts** - Custom deals with SLAs (10% premium)
5. **Add-ons** - Feature extensions for upselling

### Target Metrics

- **MRR/ARR** - Monthly/Annual Recurring Revenue
- **Churn Rate** - Target <5%
- **LTV/CAC** - Lifetime Value/Customer Acquisition (aim 3:1)
- **Conversion Rate** - Freemium to paid (15-30%)

### Publisher Economics

- **Revenue Share** - 80% to publisher, 20% to platform (industry standard)
- **Payout Methods** - Stripe Connect, PayPal, bank transfer
- **Payout Schedule** - Monthly
- **Minimum Payout** - $50

## Type Safety

All functions are fully typed with TypeScript:

```typescript
// Type-safe calculations
const result: PriceBreakdown = PricingCalculator.calculate(model, options);

// Type-safe entitlement checks
const check: EntitlementResult = EntitlementEngine.checkAccess(entitlement, action);

// Discriminated union exhaustiveness
function handlePricing(model: PricingModel) {
  switch (model.chargeModel) {
    case 'none': // FreePricingModel
      return 0;
    case 'flat': // FlatSubscriptionModel
      return model.priceMonthly;
    case 'per_seat': // PerSeatModel
      return model.pricePerSeat * model.seats.min;
    // TypeScript ensures all cases are handled
  }
}
```

## Testing

```typescript
import { describe, it, expect } from 'vitest';
import { EntitlementEngine, PricingCalculator } from '@dndhub/marketplace';

describe('EntitlementEngine', () => {
  it('should deny access when limit exceeded', () => {
    const entitlement: Entitlement = {
      userId: 'user_123' as NID,
      productId: 'prod_456' as NID,
      capabilities: {
        features: { included: [] },
        limits: { apiCalls: 1000 }
      },
      usage: {
        current: { apiCalls: 1000 },
        limits: { apiCalls: 1000 },
        resetAt: new Date()
      },
      validUntil: new Date(Date.now() + 86400000)
    };

    const result = EntitlementEngine.checkLimit(entitlement, 'apiCalls', 1);
    
    expect(result.permitted).toBe(false);
    expect(result.code).toBe('LIMIT_EXCEEDED');
  });
});
```

## Best Practices

### 1. Always Check Entitlements at Runtime

```typescript
// ❌ Don't check only in UI
if (userTier === 'pro') {
  await executeExpensiveOperation();
}

// ✅ Check at execution time
const check = EntitlementEngine.checkAccess(entitlement, {
  featureId: 'expensive_operation'
});
if (check.permitted) {
  await executeExpensiveOperation();
}
```

### 2. Meter Usage Consistently

```typescript
// ✅ Always increment after successful operations
try {
  await operation();
  entitlement = UsageMeter.increment(entitlement, 'operations', 1);
  await saveEntitlement(entitlement);
} catch (error) {
  // Don't increment on failure
}
```

### 3. Use Configuration Templates

```typescript
// ✅ Extend preset configurations
import { fluxrPricingConfig } from '@dndhub/marketplace/configs';

const customConfig: PricingConfiguration = {
  ...fluxrPricingConfig,
  tiers: {
    ...fluxrPricingConfig.tiers,
    enterprise: {
      ...fluxrPricingConfig.tiers.enterprise,
      contract: {
        ...fluxrPricingConfig.tiers.enterprise.contract,
        minCommitmentUSD: 10000 // Custom minimum
      }
    }
  }
};
```

### 4. Handle Trial Periods

```typescript
import { SubscriptionManager } from '@dndhub/marketplace';

if (SubscriptionManager.isInTrial(subscription)) {
  // Show trial expiry warnings
  const daysLeft = SubscriptionManager.getDaysUntilExpiry(subscription);
  if (daysLeft <= 3) {
    showTrialExpiryWarning(daysLeft);
  }
}
```

## Migration Guide

### From Simple Tier System

```typescript
// Before (basic tier check)
if (user.tier === 'pro') {
  await executeQuery();
}

// After (entitlement-based)
const entitlement = await getEntitlement(user.id);
const check = EntitlementEngine.checkAccess(entitlement, {
  featureId: 'advanced_queries'
});
if (check.permitted) {
  await executeQuery();
}
```

### From Usage Counting to Metering

```typescript
// Before (manual counting)
user.apiCallsThisMonth += 1;
if (user.apiCallsThisMonth > user.tier.limit) {
  throw new Error('Limit exceeded');
}

// After (automated metering)
const check = EntitlementEngine.checkLimit(
  entitlement,
  'apiCalls',
  1
);
if (!check.permitted) {
  throw new Error(check.message);
}
entitlement = UsageMeter.increment(entitlement, 'apiCalls', 1);
```

## Roadmap

- [ ] Multi-currency support with real-time conversion
- [ ] Volume discounts and promotional codes
- [ ] Organization-wide subscriptions
- [ ] Cross-product bundles
- [ ] Affiliate program integration
- [ ] Advanced analytics dashboards

## License

Commercial - Part of the DNDHUB ecosystem

## Support

- Documentation: https://docs.dndhub.com/marketplace
- Issues: https://github.com/dndhub/marketplace/issues
- Slack: #marketplace channel