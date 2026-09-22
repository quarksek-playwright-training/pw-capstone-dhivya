import { BasePage } from "./BasePage";
import type { Locator, Page } from "@playwright/test";
export class ProfilePage extends BasePage {
    readonly settingsTab: Locator;
    readonly settingsTitle: Locator;
    readonly urlTextBox: Locator;
    readonly usernameTextBox: Locator;
    readonly bioTextBox: Locator;
    readonly emailTextBox: Locator;
    readonly passwordTextBox: Locator;
    readonly updateSettingsButton: Locator;
    readonly profileName: Locator;
    readonly myPostsTab: Locator;
    constructor(page: Page) {
        super(page, '/settings');
        this.settingsTab = page.locator("//li[a[contains(., \"New Article\")]]/following-sibling::li/a[contains(., \"Settings\")]");
        this.urlTextBox = page.getByRole('textbox', { name: 'URL of profile picture' });
        this.usernameTextBox = page.getByRole('textbox', { name: 'Username' });
        this.bioTextBox = page.getByRole('textbox', { name: 'Short bio about you' });
        this.emailTextBox = page.getByRole('textbox', { name: 'Email' });
        this.passwordTextBox = page.getByRole('textbox', { name: 'New Password' });
        this.settingsTitle = page.getByRole('heading', { name: 'Settings' });
        this.updateSettingsButton = page.getByRole('button', { name: 'Update Settings' });
        this.profileName = page.getByRole('link', { name: 'testusername1' }).first();
        this.myPostsTab = page.getByRole('link', { name: 'My Posts' });
    }
    async updateSettings(url: string, username: string, bio: string, email: string, password: string) {
        await this.urlTextBox.fill(url);
        await this.usernameTextBox.fill(username);
        await this.bioTextBox.fill(bio);
        await this.emailTextBox.fill(email);
        await this.passwordTextBox.fill(password);
        await this.updateSettingsButton.click();
    }
    async getArticleTitles() {
        await this.profileName.click();
        await this.myPostsTab.click();
    }
}