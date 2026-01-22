# @dndhub/error

[![npm version](https://badge.fury.io/js/%40dndhub%2Ferror.svg)](https://badge.fury.io/js/%40dndhub%2Ferror)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/dndhub/error)

## Overview

`@dndhub/error` provides a structured, extensible error handling class called `DomsError` for the DNDHUB ecosystem. It extends the native JavaScript `Error` class with enhanced features like taxonomy-based classification, immutable attributes for error identity, mutable metadata for customization, and security-focused sanitization to prevent information leakage. This library is designed for consistent error management across applications, supporting logging, serialization, and matching based on standardized taxonomies from `@dndhub/domspec`.

Key features:
- **Taxonomy Integration**: Uses predefined enums for severity, categories, types, and security contexts (e.g., CAPEC, CWE, OWASP mappings).
- **Immutability & Extensibility**: Core attributes are frozen for reliability, while metadata allows custom fields.
- **Logging & Sanitization**: Built-in console logging with level-based formatting and production-safe sanitization.
- **Security Focus**: Includes attack vectors, complexities, and mitigation metadata to handle vulnerabilities effectively.

This is a simplified implementation suitable for levels 1 to 4 of error handling complexity:
- **Level 1**: Basic error creation and logging (beginner-friendly).
- **Level 2**: Adding custom metadata and context.
- **Level 3**: Using taxonomy for classification and matching.
- **Level 4**: Advanced security features, cloning, and integration with ecosystems.

For full documentation, see the [Wiki](https://github.com/dndhub/error/wiki/DomsError).

## Installation

Install via npm:

```bash
npm install @dndhub/error @dndhub/domspec
```

Note: This package depends on `@dndhub/domspec` for taxonomy types.

## Usage

Import and use `DomsError` in your TypeScript/JavaScript projects.

### Level 1: Basic Error Creation and Logging

For simple errors, create an instance with a code and message, then log it.

```typescript
import { DomsError } from '@dndhub/error';

try {
  throw new DomsError('AUTH_FAILED', 'Authentication failed');
} catch (error) {
  if (error instanceof DomsError) {
    error.console('Authentication error occurred');
    console.log(error.toJSON());
  }
}
```

Output (console):
```
[DomsError] {
  timestamp: '2025-08-22T12:00:00.000Z',
  level: 'error',
  code: 'AUTH_FAILED',
  runtime: 'unknown',
  message: 'Authentication error occurred',
  attributes: { name: 'DomsError', severity: 'error', category: 'unknown' },
  metadata: { message: 'Authentication failed', level: 'error' }
}
```

JSON serialization:
```json
{
  "name": "DomsError",
  "code": "AUTH_FAILED",
  "message": "Authentication failed",
  "timestamp": "2025-08-22T12:00:00.000Z",
  "runtime": "unknown",
  "attributes": { "name": "DomsError", "severity": "error", "category": "unknown" }
}
```

### Level 2: Adding Metadata and Context

Enhance errors with mutable metadata (e.g., descriptions, fixes) and runtime context (e.g., user ID, stack).

```typescript
import { DomsError } from '@dndhub/error';
import type { ErrorRuntimeTaxonomy } from '@dndhub/domspec';

const error = DomsError.create('DB_CONNECTION_FAILED', {
  message: 'Failed to connect to database',
  runtime: 'server' as ErrorRuntimeTaxonomy,
  metadata: {
    description: 'Connection timeout after 30 seconds',
    fix: 'Check database credentials and network',
    level: 'critical'
  },
  context: {
    userId: 'user-123',
    environment: 'production'
  }
});

error.console('Database error', 'critical');
```

This adds flexible details for debugging without altering core error identity.

### Level 3: Taxonomy-Based Classification and Matching

Use taxonomies for structured classification. Match errors against criteria for handling.

```typescript
import { DomsError } from '@dndhub/error';
import type { CoreErrorSeverity, CoreErrorCategory, ErrorRuntimeTaxonomy } from '@dndhub/domspec';

const error = new DomsError({
  code: 'VALIDATION_ERROR',
  runtime: 'client' as ErrorRuntimeTaxonomy,
  consoleLog: true,
  serverLog: false,
  attributes: {
    severity: 'warning' as CoreErrorSeverity,
    category: 'validation' as CoreErrorCategory,
    type: 'input'
  },
  metadata: {
    message: 'Invalid email format',
    documentationUrl: 'https://docs.example.com/errors/validation'
  }
});

if (error.matches({ code: 'VALIDATION_ERROR', runtime: 'client' })) {
  console.log('Handled validation error on client');
}
```

Taxonomies ensure consistency across your codebase (e.g., severity: 'info', 'warning', 'error', 'critical').

### Level 4: Advanced Security Features and Utilities

For security-sensitive applications, include attack patterns, weaknesses, and sanitization.

```typescript
import { DomsError } from '@dndhub/error';
import type { CAPECAttackPatternTypeTaxonomy, CWELevelTaxonomy } from '@dndhub/domspec';

const securityError = new DomsError({
  code: 'SQL_INJECTION_DETECTED',
  runtime: 'server',
  consoleLog: false, // Disable console in prod for security
  serverLog: true,
  attributes: {
    severity: 'critical',
    category: 'security',
    attackPatternType: 'injection' as CAPECAttackPatternTypeTaxonomy,
    weaknessLevel: 'high' as CWELevelTaxonomy,
    capecId: 'CAPEC-66',
    cweId: 'CWE-89',
    owaspId: 'A03:2021',
    attackVector: 'network',
    attackComplexity: 'low',
    privilegesRequired: 'none',
    userInteraction: 'none'
  },
  metadata: {
    threatIndicators: ['Suspicious input patterns'],
    mitigationSteps: ['Use prepared statements', 'Input sanitization'],
    detectionPattern: '/union.*select/i'
  },
  context: {
    ipAddress: '192.168.1.1',
    deviceFingerprint: { userAgent: 'Mozilla/5.0...' }
  }
});

// Sanitize for client response
const sanitized = DomsError.sanitize(securityError);
console.log(sanitized); // Safe output in production

// Clone with overrides
const clonedError = securityError.clone({
  code: 'XSS_DETECTED',
  attributes: { attackPatternType: 'abuse' }
});
```

Utilities like `sanitize` prevent leaks in production (e.g., hides stack traces), while `clone` allows error derivation.

## API Reference

### Class: DomsError

Extends `Error`. Implements `DomErrorProps`.

- **Constructor**:
  - `new DomsError(errorPropsOrCode: ErrorProps | string, message?: string, context?: ErrorContext)`
  - Simple: `new DomsError('CODE', 'Message')`
  - Full: Pass an `ErrorProps` object.

- **Static Methods**:
  - `create(code: string, options?: {...})`: Factory for quick creation.
  - `sanitize(error: Error | ErrorProps | unknown)`: Returns a safe JSON object.

- **Instance Methods**:
  - `getErrorProps(): ErrorProps`
  - `getDomsErrorMetadata(): ErrorMetadata`
  - `getDomsErrorContext(): ErrorContext`
  - `toJSON(): Record<string, any>`
  - `console(message: string, level?: ErrorLogLevelTaxonomy, errorDetails?: ErrorProps): Promise<void>`
  - `matches(criteria: Partial<ErrorProps>): boolean`
  - `clone(overrides?: Partial<ErrorProps>): DomsError`

For full type definitions, see [error.d.ts](./error.d.ts).

## Configuration

- Set `process.env.NODE_ENV = 'production'` to enable sanitization.
- Customize logging by toggling `consoleLog` and `serverLog` in `ErrorProps`.

## Contributing

Contributions welcome! See [CONTRIBUTING.md](https://github.com/dndhub/error/blob/main/CONTRIBUTING.md).

1. Fork the repo.
2. Create a branch: `git checkout -b feature/new-feature`.
3. Commit changes: `git commit -am 'Add new feature'`.
4. Push: `git push origin feature/new-feature`.
5. Submit a Pull Request.

## License

MIT License. See [LICENSE](https://github.com/dndhub/error/blob/main/LICENSE).