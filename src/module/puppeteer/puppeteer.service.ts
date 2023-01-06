import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
    async example(url: string): Promise<any> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        await page.goto(url);

        await browser.close();
        return 'done';
    }
}
