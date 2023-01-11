import { Injectable, Logger } from '@nestjs/common';
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

    public async getHotdeal(): Promise<[]> {
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

        const $ = cheerio.load(html);
        //#revolution_main_table > tbody > tr:nth-child(7) > td:nth-child(3) > table > tbody > tr > td:nth-child(2) > div > a > font
        // 핫게시글 추출 #revolution_main_table 테이블 중 class 가 list1, list0 인 tr
        // const hot = $('#revolution_main_table .list1,.list0')
        //     .map((_, element) => {
        //         const tr = $(element);
        //
        //         const a = tr.find('td').eq(3).find('a');
        //
        //         return {
        //             link: `http://www.ppomppu.co.kr/zboard/${a.attr('href')}`,
        //             title: a.text(),
        //         };
        //     })
        //     .get();

        // 핫딜 기준
        // 1. 종료가 되지 않은 딜
        // 1.1 tr.find('img').length === 3은 종료된 딜이다.
        // 2. 핫딜 아이콘이 있는 딜
        // 2.1 tr.find('img').get(1).attributes[0].value === /images/menu/hot_icon2.jpg
        // 3. 인기딜인데 댓글이 많은거
        // 3.1 댓글대비 추천수 비교
        const hot = $('#revolution_main_table .list1,.list0')
            .map((_, element) => {
                const tr = $(element);
                if (tr.find('img').length === 2) {
                    const imgName = tr.find('img').get(1).attributes[0].value;
                    if (imgName.includes('hot_icon')) {
                        return {
                            title: tr
                                .find('table')
                                .find('tr')
                                .find('td')
                                .find('a')
                                .text(),
                            description: '',
                            image_url:
                                'http:' +
                                tr
                                    .find('table')
                                    .find('tr')
                                    .find('img')
                                    .attr('src'),
                            image_width: 640,
                            image_height: 640,
                            link: {
                                web_url: `http://www.ppomppu.co.kr/zboard/${tr
                                    .find('table')
                                    .find('tr')
                                    .find('td')
                                    .find('a')
                                    .attr('href')}`,
                                mobile_web_url: `http://m.ppomppu.co.kr/new/bbs_${tr
                                    .find('table')
                                    .find('tr')
                                    .find('td')
                                    .find('a')
                                    .attr('href')}`,
                            },
                        };
                    }
                }

                // 사이즈가 3이면 종료아이콘이 있는거임.
                // console.log(tr.find('img').get(1).attributes[0].value);
                // 여기 컨테인이 /images/menu/hot_icon2.jpg 핫딜
                // /images/menu/pop_icon2.jpg 인기딜
                // console.log(tr.find('img').length);
                // console.log(
                //     tr.find('table').find('tr').find('td').find('a').text(),
                // );
                // image
                // tr.find('table').find('tr').find('img').attr('src')
                // title with 댓글수
                // console.log(tr.find('table').find('tr').find('td').text());
                // tr.find('.list_comment2').text()
                // title
                // tr.find('table').find('tr').find('td').find('a').text()
                // link
                // tr.find('table').find('tr').find('td').find('a').attr('href')
                // 리스트의 마지막 바로전이 추천-비추천수
                // tr.text().split('\t')[tr.text().split('\t').length-2]
                ///images/menu/hot_icon2.jpg

                // {
                //     title: '비쥬얼이 끝내주는 오레오 카푸치노',
                //         description: '매거진',
                //     image_url:
                //     'https://mud-kage.kakao.com/dn/boVWEm/btqfFGlOpJB/mKsq9z6U2Xpms3NztZgiD1/openlink_640x640s.jpg',
                //         image_width: 640,
                //     image_height: 640,
                //     link: {
                //     web_url: 'https://www.ppomppu.co.kr',
                //         mobile_web_url: 'https://www.ppomppu.co.kr',
                // },
                // },
            })
            .get();
        return hot;
    }
}
