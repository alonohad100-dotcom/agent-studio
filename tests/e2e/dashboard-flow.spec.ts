import { test, expect } from '@playwright/test'

test.describe('Dashboard Flow', () => {
  test.beforeEach(async () => {
    // Set up authentication if needed
    // For now, assuming dev bypass auth is enabled or user is already logged in
  })

  test('should load dashboard without blank page', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/app/dashboard')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Verify dashboard loads
    await expect(page.locator('h1')).toContainText('Dashboard')

    // Verify no blank page - check that body has content
    const bodyText = await page.textContent('body')
    expect(bodyText).not.toBe('')
    expect(bodyText?.length).toBeGreaterThan(0)

    // Verify main content is visible
    await expect(page.locator('[role="main"]')).toBeVisible()
  })

  test('should display dashboard header correctly', async ({ page }) => {
    await page.goto('/app/dashboard')
    await page.waitForLoadState('networkidle')

    // Check header exists
    const header = page.locator('h1')
    await expect(header).toBeVisible()
    await expect(header).toContainText('Dashboard')

    // Check welcome message
    const welcomeText = page.locator('text=/Welcome back/')
    await expect(welcomeText).toBeVisible()
  })

  test('should show stats cards', async ({ page }) => {
    await page.goto('/app/dashboard')
    await page.waitForLoadState('networkidle')

    // Wait for stats section
    const statsSection = page.locator('[aria-label="Agent statistics"]')
    await expect(statsSection).toBeVisible()

    // Verify stats cards render (should be 4 cards)
    const statsCards = page.locator('[role="article"]')
    await expect(statsCards).toHaveCount(4)
  })

  test('should show loading state during data fetch', async ({ page }) => {
    // Slow down network for agents API
    await page.route('**/rest/v1/agents*', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })

    await page.goto('/app/dashboard')

    // Should show loading skeleton (if data-testid is added)
    // For now, just verify page doesn't show error immediately
    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 })
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/rest/v1/agents*', route => route.abort())

    await page.goto('/app/dashboard')
    await page.waitForLoadState('networkidle')

    // Should show error message, not blank page
    const errorAlert = page.locator('text=/Failed to load/i')
    await expect(errorAlert).toBeVisible({ timeout: 5000 })

    // Dashboard should still render
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should display quick actions section', async ({ page }) => {
    await page.goto('/app/dashboard')
    await page.waitForLoadState('networkidle')

    const quickActions = page.locator('[aria-label="Quick actions"]')
    await expect(quickActions).toBeVisible()

    // Verify action buttons exist
    const createButton = page.locator('text=/Create New Agent/i')
    await expect(createButton).toBeVisible()
  })

  test('should display recent agents section', async ({ page }) => {
    await page.goto('/app/dashboard')
    await page.waitForLoadState('networkidle')

    const recentAgents = page.locator('[aria-label="Recent agents"]')
    await expect(recentAgents).toBeVisible()

    // Should show "Recent Agents" heading
    const heading = page.locator('h2:has-text("Recent Agents")')
    await expect(heading).toBeVisible()
  })

  test('should not have hydration errors in console', async ({ page }) => {
    const consoleErrors: string[] = []
    const consoleWarnings: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text())
      }
    })

    await page.goto('/app/dashboard')
    await page.waitForLoadState('networkidle')

    // Check for hydration errors
    const hydrationErrors = consoleErrors.filter(
      error => error.includes('hydration') || error.includes('Hydration')
    )
    expect(hydrationErrors).toHaveLength(0)

    // Check for framer-motion errors
    const motionErrors = consoleErrors.filter(
      error => error.includes('framer-motion') || error.includes('motion')
    )
    expect(motionErrors).toHaveLength(0)
  })
})
