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

    @Interval('ppomppuHotdealTask', 5000)
    async checkLogin() {
        if (this.kakaoService.accessToken === undefined) {
            console.log('아직로그인안됨');
            //puppeteer을 이용해서 로그인처리해보자
            // const result = await this.puppeteerService.example(
            //     'https://kauth.kakao.com/oauth/authorize?client_id=&redirect_uri=http://localhost:3000/kakao-callback&response_type=code&scope=talk_message',
            // );

            this.puppeteerService
                .example(
                    'https://kauth.kakao.com/oauth/authorize?client_id=' +
                        this.clientId +
                        '&redirect_uri=http://localhost:3000/kakao-callback&response_type=code&scope=talk_message',
                )
                .then((result) => {
                    console.log(result);
                });
            // this.kakaoService
            //     .callAuth(this.clientId, this.redirectUri)
            //     .then((result) => {
            //         console.log(result);
            //     });
        } else {
            console.log('로그인댐');
            // this.ppomppuService.getHotdeal().then((result) => {
            //     //result에서 화면에 노출시킨 녀석을 map에 담아서 재조회될시에 메세지 처리 하지 않도록 한다.;
            //     this.kakaoService
            //         .kakaoMsg(result.slice(0, 3))
            //         .then((result) => {
            //             console.log(result);
            //         });
            // });
        }
    }
}
