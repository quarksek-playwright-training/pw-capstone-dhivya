import { BasePage } from "./BasePage";
import type { Page, Locator } from "@playwright/test";


export class LoginPage extends BasePage {

  readonly profileLink: (username: string) => Locator;
  readonly invalidLoginMessage: Locator;
  constructor(page: Page) {
    super(page, '/login');
    this.profileLink = (username: string) => {
      return this.page.getByRole('link', { name: username }).first();
    };
    this.invalidLoginMessage = this.page.getByText('email or password is invalid');
  }

  async open() {
    await this.navigate();
  }

  async login(email: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }
}