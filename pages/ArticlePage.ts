import { BasePage } from "./BasePage";
import type { Locator, Page } from "@playwright/test";
import { ProfilePage } from "./ProfilePage";
import { LoginPage } from "./LoginPage";
export class ArticlePage extends BasePage {

    readonly articleTab: Locator;
    readonly articleTitleInput: Locator;
    readonly articleAboutInput: Locator;
    readonly articleBodyInput: Locator;
    readonly articleTagsInput: Locator;
    readonly publishArticleButton: Locator;  
    readonly settingsTab: Locator;

    constructor(page: Page) {
        super(page, '/editor');
        
this.settingsTab = page.locator("//li[a[contains(., \"New Article\")]]/following-sibling::li/a[contains(., \"Settings\")]");
this.articleTab = page.getByRole('link', { name: '  New Article' });
this.articleTitleInput = page.getByRole('textbox', { name: 'Article Title' });
this.articleAboutInput = page.getByRole('textbox', { name: 'What\'s this article about?' });
this.articleBodyInput = page.getByRole('textbox', { name: 'Write your article (in Markdown)' });
this.articleTagsInput = page.getByRole('textbox', { name: 'Enter tags' });
this.publishArticleButton =page.getByRole('button', { name: 'Publish Article' });
    }
    async createArticle(articleTitle: string, about: string, body: string, tags: string) {
        await this.articleTitleInput.fill(articleTitle);
        await this.articleAboutInput.fill(about);
        await this.articleBodyInput.fill(body);
        await this.articleTagsInput.fill(tags);
        await Promise.all([
        this.page.waitForURL('**/article/**'),
        this.publishArticleButton.click(),
    ]);
    }
    async getArticleTitle(title: string, username: string) {
        const loginPage = new LoginPage(this.page);
        const profilePage = new ProfilePage(this.page);
        await loginPage.profileLink(username).click();
        await profilePage.myPostsTab.click();
        return this.page.getByRole('heading', { name: title });
    }

    async getArticleSlug(): Promise<string> {
    return this.page.url().split('/article/')[1];
}
}