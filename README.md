# Smarkets Exchange Front-End Take-Home

A minimal React application built for the Smarkets Front-End Engineer take-home exercise.

The application consumes the Smarkets Exchange API to authenticate users and display live exchange events, markets, contracts, and current prices. Users can browse live events from the homepage and open an event to see its available markets and contract prices.

## Features

* Smarkets account login
* Protected application routes
* Live event discovery and sport filtering
* Featured markets on the homepage
* Event detail page with available markets
* Contract-level prices
* Regular price updates using polling
* Loading, empty, and error states
* Responsive UI
* Unit, component, integration, and end-to-end tests

## Tech Stack

* **React** — required by the exercise and used to build the UI
* **TypeScript** — provides static typing for API responses, domain models, and component interfaces
* **Vite** — lightweight development and build tooling for a React application
* **TanStack Query** — handles server state, caching, refetching, and asynchronous API state
* **React Router** — handles application routing and protected routes
* **Tailwind CSS** — provides lightweight utility-based styling
* **Vitest** — unit and integration test runner compatible with the Vite toolchain
* **React Testing Library** — component and integration testing from a user-facing perspective
* **MSW** — mocks the HTTP boundary for deterministic integration tests
* **Playwright** — end-to-end testing of the main user journey

## Architecture

The application separates UI concerns, API concerns, server state, and authentication state.

```text
                    React UI
                       |
              React Router
                       |
        +--------------+--------------+
        |                             |
      Login                     Protected Routes
                                      |
                              +-------+-------+
                              |               |
                           Home Page      Event Page
                              |               |
                         React Query      React Query
                              |               |
                         API Services      API Services
                              |               |
                              +-------+-------+
                                      |
                                  apiClient
                                      |
                              Smarkets API
```

### API layer

The API layer is separated by domain:

```text
src/api/
├── auth/
├── events/
├── markets/
├── contracts/
└── quotes/
```

The shared API client centralises HTTP communication and authentication headers.

This keeps API-specific concerns out of React components and makes the individual services easier to test and maintain.

### Server state

The application uses TanStack Query for server state rather than introducing a global client-state library such as Redux.

This includes:

* events
* markets
* contracts
* quotes
* loading and error state
* caching and refetching

Authentication state is kept separately in `AuthProvider` because it represents application/session state rather than general server data.

## Authentication

Users authenticate through the Smarkets session API.

After a successful login, the returned session token is stored by the authentication context and attached to authenticated API requests.

Protected routes prevent unauthenticated users from accessing the main application.

### Authentication trade-off

For this client-only take-home implementation, the session token is persisted in browser storage so that the session survives a page refresh.

For a production application, I would prefer a server-managed session using an `HttpOnly`, `Secure`, `SameSite` cookie, potentially behind a Backend-for-Frontend (BFF). This would prevent the browser-side JavaScript application from directly reading the session credential.

## Data Flow

The API data is consumed progressively rather than fetching the entire hierarchy at startup.

```text
Events
  ↓
Markets for selected events
  ↓
Contracts for selected markets
  ↓
Current quotes
```

The application follows the hierarchical structure exposed by the Smarkets API.

A contract represents an individual selectable outcome within a market, while quotes provide the current exchange price information.

## Price Updates

The application uses controlled polling for quote updates.

The quote query periodically refetches current prices while the relevant page is active.

The current implementation uses a four-second polling interval as a pragmatic trade-off for this exercise.

The reasoning was:

* prices should visibly update regularly
* the exercise is intentionally minimal
* aggressive polling would create unnecessary API traffic
* the API has rate limits
* background polling is disabled

If the application were taken to production scale, I would revisit the update strategy based on product latency requirements, API limits, traffic volume, and available streaming capabilities.

## Performance Considerations

The main performance considerations were:

* limiting the number of initially visible events
* only fetching market data for visible events
* avoiding polling while the application is in the background
* using TanStack Query caching
* separating server state from local UI state
* avoiding unnecessary global state

The current implementation is intentionally simple because the exercise has a strict six-hour time limit.

With additional time, I would further investigate:

* request fan-out when many events and markets are displayed
* batching API requests where supported
* stronger pagination/server-side filtering
* list virtualization for large collections
* more granular cache updates
* profiling React rendering with the React Profiler
* evaluating a streaming transport if officially supported for the required data
* more advanced rate-limit/backoff handling

## Testing Strategy

The test suite is divided into multiple layers.

### Unit tests

Pure business logic is tested independently, including quote and price transformations.

### Component tests

Important UI components such as event cards and price cells are tested with React Testing Library.

### Integration tests

Integration tests exercise real application layers together:

```text
React component
    ↓
React Query
    ↓
API service
    ↓
API client
    ↓
MSW
```

MSW mocks the external network boundary, which keeps tests deterministic while still exercising the application's actual data-fetching flow.

Integration coverage includes:

* authentication
* homepage data loading
* event data loading
* empty states
* API error states
* markets, contracts, and quotes

### End-to-end testing

Playwright covers the main user journey:

```text
Login
  ↓
Homepage
  ↓
Open event
  ↓
View markets
  ↓
View contract prices
```

The external API is mocked for E2E tests so the tests remain deterministic and do not depend on external availability or live market data.

## Error Handling

The application handles common UI states including:

* loading
* empty data
* API failures
* authentication failures
* unauthorised responses

Authentication failures are centralised in the API client and propagated to the authentication context.

## Challenges

The main challenges were:

### Understanding the event hierarchy

The Smarkets API exposes a hierarchy of events rather than returning only directly marketable matches from the root events endpoint.

The implementation therefore distinguishes top-level sports/events from live events and uses the event relationships exposed by the API.

### Managing multiple dependent API requests

Market data depends on the selected events, while contract data depends on the selected markets.

TanStack Query was used to manage these asynchronous dependencies and cache their results.

### Updating exchange prices

The exercise required prices to update regularly. Controlled polling was chosen for the take-home implementation to keep the solution simple while still demonstrating continuously changing market data.

## Why These Technologies?

### Why TanStack Query?

Most of the application's state is remote server state.

TanStack Query provides:

* caching
* refetching
* query lifecycle management
* loading/error state
* request deduplication

Using Redux for this data would introduce additional client-state complexity without a clear benefit for this scope.

### Why Vite?

The exercise only required React and a minimal web application.

Vite provides a lightweight development setup and allows the implementation to focus on the exercise requirements without introducing additional framework features that were not required.

### Why TypeScript?

The Smarkets API exposes multiple related domain models and asynchronous responses.

TypeScript provides safer contracts between the API layer, React Query hooks, and UI components.

### Why MSW?

MSW allows the tests to mock the external network boundary while keeping the internal application data flow real.

This provides more realistic integration coverage than mocking the API service itself.

### Why Playwright?

The exercise has an important user journey spanning authentication, routing, data loading, and market display.

Playwright provides browser-level validation of this complete flow.

## Trade-offs

### Polling vs streaming

Polling was chosen because it keeps the take-home implementation minimal and uses the available HTTP quote endpoint without introducing unsupported assumptions about a streaming transport.

A production implementation would evaluate a supported streaming mechanism if lower-latency updates were required.

### localStorage vs HttpOnly cookie

Browser storage was chosen because this is a client-only exercise and there is no backend-for-frontend.

For production, I would prefer a server-managed `HttpOnly`, `Secure`, `SameSite` cookie.

### TanStack Query vs Redux

TanStack Query was chosen for server state. A global client-state library was intentionally avoided because the application has limited client-only state.

If the application grew to contain significant cross-cutting client state, I would reassess this decision.

## What I Would Improve With More Time

Given the six-hour constraint, the implementation intentionally focuses on the core requirements.

With additional time, I would:

1. Improve the event detail information and richer event metadata.
2. Introduce stronger pagination and request batching.
3. Improve large-list rendering with virtualization.
4. Add more comprehensive accessibility coverage.
5. Add performance profiling and production-oriented instrumentation.
6. Improve authentication security using a BFF and HttpOnly cookies.
7. Add more robust rate-limit handling and adaptive polling/backoff.
8. Expand E2E coverage and integrate the test suite into CI.
9. Evaluate a supported real-time streaming transport for price updates.

## Running Locally

### Requirements

* Node.js 20.19+ or a compatible Node.js version supported by Vite 7

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The Vite development server proxies `/api` requests to the Smarkets API.

### Run a production build

```bash
npm run build
```

### Run unit/integration tests

```bash
npm run test:run
```

### Run tests interactively

```bash
npm run test
```

### Run end-to-end tests

```bash
npm run test:e2e
```

## Notes

This project was implemented specifically for the Smarkets Front-End Engineer take-home exercise and intentionally prioritises a focused, explainable implementation within the six-hour time constraint.
