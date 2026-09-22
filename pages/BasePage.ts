import { Page } from "@playwright/test";

export class BasePage {
  constructor(
    protected readonly page: Page,
    private path: string
  ) {}

  async navigate() {
    await this.page.goto(this.path);
  }
}