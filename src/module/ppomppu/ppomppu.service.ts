import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class PpomppuService {
    private readonly URL: string =
        'https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu&page=1&hotlist_flag=999&divpage=66';
    // private readonly API_KEY = {
    //     'X-Naver-Client-Id': process.env.BOOKAPI_ID,
    //     'X-Naver-Client-Secret': process.env.BOOKAPI_PW
    // };

    private readonly logger = new Logger(PpomppuService.name);

    //@Cron('10 * * * * *', { name: 'ppomppuTask' })
    @Interval('hotdealTask', 5000)
    public async getPpompuHotdeal() {
        this.test().then((result) => {
            console.log(result);
        });
    }
    public async test() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const iconv = require('iconv-lite');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cheerio = require('cheerio');

        // 뽐뿌게시판 핫게시글 1페이지 url
        const response = await axios.get(this.URL, {
            responseEncoding: 'binary',
            responseType: 'arraybuffer',
        });

        // 대상 페이지 인코딩이 요즘 거의 볼 수 없는 EUC-KR 이라서 별도 처리가 필요하다. UTF-8 이면 필요없음
        const html = iconv.decode(response.data, 'euc-kr').toString();

        console.log(html);
        const $ = cheerio.load(html);

        // 핫게시글 추출 #revolution_main_table 테이블 중 class 가 list1, list0 인 tr
        const hot = $('#revolution_main_table .list1,.list0')
            .map((_, element) => {
                const tr = $(element);

                const a = tr.find('td').eq(3).find('a');

                return {
                    link: `http://www.ppomppu.co.kr/zboard/${a.attr('href')}`,
                    title: a.text(),
                };
            })
            .get();

        return hot;
    }
}
