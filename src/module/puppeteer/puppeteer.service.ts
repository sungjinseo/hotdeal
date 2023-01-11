import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
    async example(url: string): Promise<any> {
        const browser = await puppeteer.launch({
            headless: false,
        });

        // await browser.userAgent(
        //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
        // );

        const page = await browser.newPage();
        //await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36");
        await page.goto(url);

        await page.evaluate(
            (id, pw) => {
                document.querySelector('input[name="id"]').value = id;
                document.querySelector('input[name="password"]').value = pw;
            },
            hisnet_id,
            hisnet_pw,
        );

        //로그인 버튼을 클릭해라
        await page.click('input[src="/2012_images/intro/btn_login.gif"]');

        //로그인 화면이 전환될 때까지 .5초만 기다려라
        await page.waitFor(500);

        //로그인 실패시(화면 전환 실패시)
        if (page.url() === 'https://hisnet.handong.edu/login/_login.php') {
            student_id = 'nope';
            name = 'nope';
        }

        await page.waitForTimeout(115000);
        await page.close();
        await browser.close();

        return 'done';
    }
}
