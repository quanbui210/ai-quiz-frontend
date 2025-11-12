# Testing Guide

This project uses a comprehensive testing strategy with multiple testing layers to ensure code quality and reliability.

## Testing Strategy

### 1. **Unit Tests** (Vitest)
- **Purpose**: Test individual functions, utilities, and pure logic
- **Location**: `**/*.test.ts` or `**/*.test.tsx`
- **Best for**: 
  - Utility functions (`lib/utils.ts`)
  - Zustand stores
  - Custom hooks logic
  - Type validation

### 2. **Component Tests** (Vitest + React Testing Library)
- **Purpose**: Test React components in isolation
- **Location**: `**/*.test.tsx`
- **Best for**:
  - UI components
  - User interactions
  - Component rendering
  - Form validation

### 3. **Integration Tests** (Vitest + MSW)
- **Purpose**: Test component interactions with APIs
- **Location**: `tests/integration/`
- **Best for**:
  - API route handlers
  - Data fetching hooks
  - Authentication flows
  - State management with API calls

### 4. **E2E Tests** (Playwright)
- **Purpose**: Test complete user flows in a real browser
- **Location**: `e2e/**/*.spec.ts`
- **Best for**:
  - Critical user journeys (login, quiz creation, quiz taking)
  - Cross-browser compatibility
  - Authentication flows
  - Navigation and routing

## Running Tests

```bash
# Run all unit/component tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests
npm run test:all
```

## Test Structure

```
├── tests/
│   ├── setup.ts              # Test configuration and mocks
│   ├── mocks/
│   │   ├── handlers.ts       # MSW request handlers
│   │   └── server.ts         # MSW server setup
│   └── integration/          # Integration tests
├── e2e/
│   ├── auth.spec.ts          # Authentication E2E tests
│   ├── dashboard.spec.ts     # Dashboard E2E tests
│   └── quiz.spec.ts          # Quiz flow E2E tests (to be added)
└── **/*.test.ts              # Unit tests (co-located with source)
```

## Writing Tests

### Unit Test Example

```typescript
// lib/utils.test.ts
import { describe, it, expect } from "vitest"
import { cn } from "./utils"

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })
})
```

### Component Test Example

```typescript
// components/ui/button.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./button"

test("should handle clicks", async () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click me</Button>)
  
  await userEvent.click(screen.getByRole("button"))
  expect(handleClick).toHaveBeenCalled()
})
```

### E2E Test Example

```typescript
// e2e/quiz.spec.ts
import { test, expect } from "@playwright/test"

test("should create and take a quiz", async ({ page }) => {
  await page.goto("/dashboard")
  await page.click("text=Start New Quiz")
  // ... test quiz creation flow
})
```

## Mocking

### API Mocking (MSW)

API requests are mocked using MSW (Mock Service Worker). Add new handlers in `tests/mocks/handlers.ts`:

```typescript
http.get(`${API_URL}/api/v1/topics`, () => {
  return HttpResponse.json([
    { id: "1", name: "JavaScript" },
  ])
})
```

### Next.js Router Mocking

The Next.js router is automatically mocked in `tests/setup.ts`. No additional setup needed.

## Coverage Goals

- **Unit Tests**: 80%+ coverage for utilities and stores
- **Component Tests**: 70%+ coverage for UI components
- **E2E Tests**: 100% coverage of critical user flows

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the user sees and does
   - Avoid testing internal implementation details

2. **Keep Tests Simple**
   - One assertion per test when possible
   - Use descriptive test names

3. **Use MSW for API Mocking**
   - Don't mock fetch/axios directly
   - Use MSW handlers for consistent mocking

4. **E2E Tests for Critical Paths**
   - Login/logout flow
   - Quiz creation and completion
   - Payment flows (if applicable)

5. **Run Tests Before Committing**
   - Use pre-commit hooks (recommended)
   - Ensure all tests pass before pushing

## CI/CD Integration

Tests should run automatically in CI/CD:

```yaml
# Example GitHub Actions
- name: Run tests
  run: |
    npm run test:coverage
    npm run test:e2e
```

## Troubleshooting

### Tests failing with "Cannot find module"
- Ensure all dependencies are installed: `npm install`
- Check that test files are in the correct location

### E2E tests timing out
- Increase timeout in `playwright.config.ts`
- Check that dev server is running on port 3000

### MSW not intercepting requests
- Ensure `server.listen()` is called in test setup
- Check that handlers match the request URLs exactly

