import { test, expect } from "@playwright/test"

test.describe("Authentication Flow", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/login/)
  })

  test("should display login page", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByText("Welcome to QuizzAI")).toBeVisible()
    await expect(
      page.getByRole("button", { name: /sign in with google/i })
    ).toBeVisible()
  })

  test.skip("should complete OAuth flow and redirect to dashboard", async ({
    page,
  }) => {})
})
