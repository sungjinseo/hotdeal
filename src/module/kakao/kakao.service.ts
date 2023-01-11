import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as config from 'config';

@Injectable()
export class KakaoService {
    private _accessToken;
    private _refreshToken;

    get accessToken(): string {
        return this._accessToken;
    }
    get refreshToken(): string {
        return this._refreshToken;
    }

    // 코드받을때 쓰는구나...
    async callAuth(clientId: string, redirectUri: string): Promise<any> {
        //https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}
        const result = await axios.get(
            'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=' +
                clientId +
                '&redirect_uri=' +
                redirectUri,
        );
        return result.data;
    }

    async kakaoLogin(options: { code: string; domain: string }): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const qs = require('querystring');
        const { code, domain } = options;
        const kakaoKey = config.get('kakao').client_id;
        const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
        const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
        const body = {
            grant_type: 'authorization_code',
            client_id: kakaoKey,
            redirect_uri: `${domain}/kakao-callback`,
            code,
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        };
        try {
            const response = await axios({
                method: 'POST',
                url: kakaoTokenUrl,
                timeout: 30000,
                headers,
                data: qs.stringify(body),
            });
            if (response.status === 200) {
                this._accessToken = response.data.access_token;
                this._refreshToken = response.data.refresh_token;
                //console.log(`kakaoToken : ${JSON.stringify(response.data)}`);
                return JSON.stringify(response.data);
            } else {
                throw new UnauthorizedException();
            }
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException();
        }
    }

    async kakaoMsg(content: string[]): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const qs = require('querystring');
        const kakaoMsgUrl =
            'https://kapi.kakao.com/v2/api/talk/memo/default/send';
        const body = {
            object_type: 'list',
            header_title: '뽐뿌핫딜이다 요녀석아',
            header_link: {
                web_url:
                    'https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu&page=1&hotlist_flag=999&divpage=66',
                mobile_web_url:
                    'https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu&page=1&hotlist_flag=999&divpage=66',
            },
            contents: content,
            buttons: [
                {
                    title: '웹으로 이동',
                    link: {
                        web_url:
                            'https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu&page=1&hotlist_flag=999&divpage=66',
                        mobile_web_url:
                            'https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu&page=1&hotlist_flag=999&divpage=66',
                    },
                },
            ],
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + this.accessToken,
        };
        console.log(JSON.stringify(body));
        try {
            const response = await axios({
                method: 'POST',
                url: kakaoMsgUrl,
                timeout: 30000,
                headers,
                data: { template_object: JSON.stringify(body) },
            });
            if (response.status === 200) {
                console.log(response.status);
                return response;
            } else {
                throw new UnauthorizedException();
            }
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException();
        }
    }
}
