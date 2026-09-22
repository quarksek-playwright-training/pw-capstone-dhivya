import {test as setup, expect } from '@playwright/test';  
import { LoginPage } from '../pages/LoginPage';
import process from 'process';

const authFile1 = ".auth/user1.json";

setup('Authentication Setup', async ({ page }) => {

    const mailid = process.env.MAILID ?? "user1@mailsac.com";
    const password = process.env.PASSWORD ?? "testusername@123";
    const username = process.env.USERNAME ?? "testusername1";

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(mailid, password);
    await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
    await page.context().storageState({ path: authFile1 });

});

const authFile2 = ".auth/user2.json";

setup('Authentication Setup2', async ({ page }) => {

    const mailid = process.env.MAILID ?? "user2@mailsac.com";
    const password = process.env.PASSWORD ?? "testusername@123";
    const username = process.env.USERNAME ?? "testusername2";

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(mailid, password);
    await expect(page).toHaveURL('https://conduit.bondaracademy.com/');
    await page.context().storageState({ path: authFile2 });

});