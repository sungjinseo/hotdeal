import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { KakaoService } from './module/kakao/kakao.service';
import { PuppeteerService } from './module/puppeteer/puppeteer.service';
import { ConfigService } from '@nestjs/config';
import * as config from 'config';
import { PpomppuService } from './module/ppomppu/ppomppu.service';

@Injectable()
export class AppService {
    // 환경변수를 이렇게 읽어오는 것은 별로 좋지 않음...생성자로 넣어도 configservice가 작동을 안해서 어쩔수 없이
    private readonly clientId = config.get('kakao.client_id');
    private readonly redirectUri = 'http://localhost:3000/kakao-callback';
    constructor(
        private kakaoService: KakaoService,
        private puppeteerService: PuppeteerService,
        private ppomppuService: PpomppuService,
    ) {}
    // constructor(
    //     private readonly configService: ConfigService,
    //     private kakaoService: KakaoService,
    // ) {
    //     this.clientId = this.configService.get<string>('CLIENT_ID');
    // }

    //@Cron('10 * * * * *', { name: 'ppomppuTask' })
    @Interval('hotdealTask', 5000)
    public async getPpompuHotdeal() {
        this.ppomppuService.test().then((result) => {
            console.log(result);
        });
    }

    //@Interval('loginCheckTask', 5000)
    async checkLogin() {
        if (this.kakaoService.accessToken === undefined) {
            console.log('아직로그인안됨');
            //puppeteer을 이용해서 로그인처리해보자
            const result = await this.puppeteerService.example('http:/');
            //this.kakaoService.callAuth(this.clientId, this.redirectUri);
        } else {
            console.log('로그인댐');
            this.kakaoService.kakaoMsg();
        }
        // if (this.kakaoService.kakaoToken === undefined) {
        //     const code = await this.kakaoService.callAuth(
        //         this.clientId,
        //         this.redirectUri,
        //     );
        //     console.log(code);
        // } else {
        //     console.log(this.kakaoService.kakaoToken);
        // }
    }
}
