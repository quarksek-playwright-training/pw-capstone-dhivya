import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; 

test('Login check', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.login(
        'user3@mailsac.com',
        'testusername@123'
    );
    await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
    await expect(loginPage.profileLink('user3')).toBeVisible();
});

test('Invalid login shows error message', { tag: ['@regression', '@auth'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.login(
        'user3@mailsac.com',
        'testusername@'
    );
    await expect(page).toHaveURL('https://conduit.bondaracademy.com/login');
    await expect(loginPage.invalidLoginMessage).toBeVisible();
    console.log('Invalid login attempt showed error message');
});