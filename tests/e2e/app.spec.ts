import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('Should navigate to /.', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
  })
})
