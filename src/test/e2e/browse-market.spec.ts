import { test, expect } from '@playwright/test';

const mockSession = {
  created_social_member: false,
  factor: 'complete',
  refresh_token: 'refresh-token',
  stop: '2026-08-18T11:22:46.139572',
  token: 'token',
  verify: false,
};

const mockEvents = {
  events: [
    {
      id: 'event-1',
      name: 'Cycling',
      full_slug: '/sport/football/arsenal-chelsea',
      state: 'live',
      type: 'generic',
      hidden: false,
      parent_id: 'football',
      start_datetime: '2026-08-18T18:00:00Z',
    },
  ],
  pagination: {
    next_page: null,
  },
};

const mockMarkets = {
  markets: [
    {
      id: 'market-1',
      name: 'Match Winner',
    },
  ],
};

const mockContracts = {
  contracts: [
    {
      id: 'contract-1',
      name: 'Arsenal',
    },
    {
      id: 'contract-2',
      name: 'Draw',
    },
    {
      id: 'contract-3',
      name: 'Chelsea',
    },
  ],
};

const mockQuotes = {
  'contract-1': {
    bids: [{ price: 5000, volume: 100 }],
    offers: [{ price: 5100, volume: 100 }],
  },
  'contract-2': {
    bids: [{ price: 3300, volume: 80 }],
    offers: [{ price: 3400, volume: 70 }],
  },
  'contract-3': {
    bids: [{ price: 3000, volume: 120 }],
    offers: [{ price: 3100, volume: 90 }],
  },
};

test.describe('Browse market', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v3/sessions/', async (route) => {
      const request = route.request();

      const body = request.postDataJSON();

      if (
        body?.username !== 'test@example.com' ||
        body?.password !== 'Parisadrb@2003'
      ) {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error_type: 'INVALID_CREDENTIALS',
            data: 'Invalid credentials',
          }),
        });

        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSession),
      });
    });

    await page.route('**/api/v3/events/**', async (route) => {
      const url = new URL(route.request().url());

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockEvents),
      });
    });

    await page.route(
      '**/api/v3/events/event-1/markets/',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockMarkets),
        });
      }
    );

    await page.route(
      '**/api/v3/markets/market-1/contracts/',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockContracts),
        });
      }
    );

    await page.route(
      '**/api/v3/markets/market-1/quotes/',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockQuotes),
        });
      }
    );
  });

  test('logs in and browses an event market', async ({ page }) => {
    // 1. Open login page
    await page.goto('/login');

    await expect(
      page.getByText(/Sign in to Smarkets/i)
    ).toBeVisible();

    // 2. Fill login form
    await page.getByLabel('Email').fill('test@example.com');

await page
  .getByRole('textbox', { name: 'Password' })
  .fill('Parisadrb@2003');

    // 3. Submit login
    await page
      .getByRole('button', { name: /continue/i })
      .click();

    // 4. We should be redirected to home
    await expect(page).toHaveURL(/\/$/);

    // 5. Home should show live event
    await expect(
      page.getByText('Cycling')
    ).toBeVisible();

    // 6. Click the event
    await page
      .locator('a[href="/event/event-1"]')
      .click();

    // 7. We should be on event page
    await expect(page).toHaveURL('/event/event-1');

    // 8. Market should be visible
    await expect(
      page.getByText('Match Winner')
    ).toBeVisible();

    // 9. Contracts should be visible
    await expect(
      page.getByText('Arsenal')
    ).toBeVisible();

    await expect(
      page.getByText('Draw')
    ).toBeVisible();

    await expect(
      page.getByText('Chelsea')
    ).toBeVisible();

    // 10. Arsenal price should be visible
    await expect(
      page.getByText('2.00')
    ).toBeVisible();
  });
});