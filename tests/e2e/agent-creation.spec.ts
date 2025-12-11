import { test, expect } from '@playwright/test'

test.describe('Agent Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sign-in page
    await page.goto('/auth/sign-in')
    
    // For development, use dev login if available
    // In production, would handle magic link flow
    const devLoginButton = page.locator('button:has-text("Dev Login")')
    if (await devLoginButton.isVisible()) {
      await devLoginButton.click()
      await page.waitForURL(/\/app\/dashboard/)
    }
  })

  test('user can create agent and edit spec', async ({ page }) => {
    // Navigate to create agent page
    await page.goto('/app/agents/new')
    
    // Fill in agent details
    await page.fill('input[name="name"]', 'E2E Test Agent')
    await page.fill('textarea[name="description"]', 'Test description for E2E testing')
    
    // Submit form
    await page.click('button:has-text("Create Agent")')
    
    // Should redirect to overview
    await expect(page).toHaveURL(/\/app\/agents\/[^/]+\/overview/)
    
    // Navigate to spec page
    await page.click('a:has-text("Edit Specification")')
    await expect(page).toHaveURL(/\/app\/agents\/[^/]+\/spec/)
    
    // Edit mission block
    const problemTextarea = page.locator('textarea[name="mission.problem"]')
    await problemTextarea.fill('Test problem statement')
    
    // Wait for autosave indicator (if present)
    const autosaveIndicator = page.locator('[data-testid="autosave-indicator"]')
    if (await autosaveIndicator.isVisible()) {
      await expect(autosaveIndicator).toContainText(/saved|saving/i, { timeout: 10000 })
    }
    
    // Verify data persisted by reloading
    await page.reload()
    await expect(problemTextarea).toHaveValue('Test problem statement')
  })

  test('user can compile and view instructions', async ({ page }) => {
    // Assume agent already exists (from previous test or fixture)
    await page.goto('/app/agents')
    
    // Click on first agent
    const firstAgent = page.locator('[data-testid="agent-card"]').first()
    if (await firstAgent.isVisible()) {
      await firstAgent.click()
      
      // Navigate to instructions
      await page.click('a:has-text("Instructions")')
      
      // Should see prompt package or compile button
      const compileButton = page.locator('button:has-text("Compile")')
      if (await compileButton.isVisible()) {
        await compileButton.click()
        // Wait for compilation
        await page.waitForTimeout(2000)
      }
      
      // Should see prompt layers
      await expect(page.locator('text=System Backbone').or(page.locator('text=Domain Manual'))).toBeVisible({ timeout: 10000 })
    }
  })
})

