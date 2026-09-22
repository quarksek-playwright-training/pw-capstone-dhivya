import fs from 'fs';
import { test as base, expect, request } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.ts';
import { ArticlePage } from './pages/ArticlePage.ts';
import { ProfilePage } from './pages/ProfilePage.ts';

type Fixtures = {
    loginPage: LoginPage;
    articlePage: ArticlePage;
    profilePage: ProfilePage;
    apiRequest: APIRequestContext;
};
export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    articlePage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        const articlePage = new ArticlePage(page);
        await use(articlePage);
    },
    profilePage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login('user1@mailsac.com', 'testusername@123');
        const profilePage = new ProfilePage(page);
        await use(profilePage);
    },
    apiRequest: async ({}, use) => {
    const authState = JSON.parse(
        fs.readFileSync('.auth/user1.json', 'utf-8')
    );

    const jwtToken = authState.origins
        .find(
            (origin: any) =>
                origin.origin === 'https://conduit.bondaracademy.com'
        )
        ?.localStorage.find(
            (item: any) => item.name === 'jwtToken'
        )?.value;

    if (!jwtToken) {
        throw new Error('jwtToken not found in .auth/user1.json');
    }

    const context = await request.newContext({
        baseURL: 'https://conduit-api.bondaracademy.com',
        extraHTTPHeaders: {
            Authorization: `Token ${jwtToken}`,
        },
    });

    await use(context);
    await context.dispose();
},
});


export { expect } from '@playwright/test';