import { test, expect } from '../fixtures.ts';
import { LoginPage } from '../pages/LoginPage.ts';
import { ArticlePage } from '../pages/ArticlePage.ts';
import { ProfilePage } from '../pages/ProfilePage.ts';  
let articleSlug: string;
const articleData = [
  {
    title: 'Automation Article',
    tag: 'Automation'
  },
  {
    title: 'Playwright Article',
    tag: 'Playwright'
  },
  {
    title: 'Testing Article',
    tag: 'Testing'
  }
];
test.describe('Articles', () => {
test('create an article and verify it appears under the profile', { tag: ['@smoke', '@articles'] }, async ({ articlePage }) => {
    const articleTitle = `Test Title ${test.info().project.name}-${Date.now()}`;
    await articlePage.settingsTab.hover();
    await articlePage.articleTab.click();
    await articlePage.createArticle(articleTitle, 'Test Description', 'Test Body', 'Test Tag');
    articleSlug = await articlePage.getArticleSlug();
    console.log(articleSlug);
    await expect(await articlePage.getArticleTitle(articleTitle, 'testusername1')).toHaveText(articleTitle);
    console.log(`Verified created article under the profile with title: ${articleTitle}`);
});

test('article from one account is not visible in another account profile', { tag: ['@regression', '@articles'] },async ({
  browser
}) => {

  const user2Context = await browser.newContext({
    storageState: '.auth/user2.json'
  });

  const user2Page = await user2Context.newPage();
  const user2ProfilePage = new ProfilePage(user2Page);
  const loginPage = new LoginPage(user2Page);
  await user2Page.goto('/');
  await loginPage.profileLink('testusername2').click();
        await user2ProfilePage.myPostsTab.click();
  const noPreview = user2Page.locator("(//div[@class='article-preview'])[1]");
  await expect(
    noPreview
  ).toBeVisible();

  await user2Context.close();
});

test(
    'Display empty state when article feed returns no results',
    { tag: ['@regression', '@articles', '@negative'] },
    async ({ page }) => {

      // Intercept article feed API
      await page.route('**/api/articles**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            articles: [],
            articlesCount: 0
          })
        });
      });
      await page.goto('/');
      await expect(
        page.getByText('No articles are here... yet.')
      ).toBeVisible();
    }
  );
test(
  'create multiple articles and verify each article under its tag',
  { tag: ['@regression', '@articles'] },
  async ({ articlePage }) => {

    for (const article of articleData) {
      const articleTitle = `${article.title}-${Date.now()}`;
      await articlePage.settingsTab.hover();
      await articlePage.articleTab.click();
      await articlePage.createArticle(
        articleTitle,
        'Test Description',
        'Test Body',
        article.tag
      );
      articleSlug = await articlePage.getArticleSlug();
      await expect(
        await articlePage.getArticleTitle(articleTitle, 'testusername1')
      ).toHaveText(articleTitle);

      console.log(
        `Created "${articleTitle}" with tag "${article.tag}"`
      );
    }
  }
);

test.afterEach(async ({ apiRequest }) => {
    if (articleSlug) {
        const response = await apiRequest.delete(
            `/api/articles/${articleSlug}`
        );
        expect(response.ok()).toBeTruthy();
        console.log(`Deleted article with slug: ${articleSlug}`);
        articleSlug = '';
    }
});
});