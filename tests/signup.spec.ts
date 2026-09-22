import { test, expect } from '@playwright/test';


test('signup with an existing account email', { tag: ['@regression', '@auth'] }, async ({ page }) => {

  await page.goto('/register');

  await page.getByPlaceholder('Username').fill('testusername2');
  await page.getByPlaceholder('Email').fill('user2@mailsac.com');
  await page.getByPlaceholder('Password').fill('testusername@123');

  console.log('Attempting to sign up with an existing email');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(
    page.getByText('email has already been takenusername has already been taken')
  ).toBeVisible();
  console.log('Signup attempt with existing email was rejected and error message displayed');
  await expect(page).toHaveURL(/register/);
});