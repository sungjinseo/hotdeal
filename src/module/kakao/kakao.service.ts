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
    async callAuth(clientId: string, redirectUri: string) {
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

                console.log(`kakaoToken : ${JSON.stringify(response.data)}`);
            } else {
                throw new UnauthorizedException();
            }
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException();
        }
    }

    async kakaoMsg(): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const qs = require('querystring');
        const kakaoMsgUrl =
            'https://kapi.kakao.com/v2/api/talk/memo/default/send';
        const body = {
            object_type: 'list',
            header_title: 'WEEKELY MAGAZINE',
            header_link: {
                web_url: 'http://www.daum.net',
                mobile_web_url: 'http://m.daum.net',
                android_execution_params: 'main',
                ios_execution_params: 'main',
            },
            contents: [
                {
                    title: '자전거 라이더를 위한 공간',
                    description: '매거진',
                    image_url:
                        'https://mud-kage.kakao.com/dn/QNvGY/btqfD0SKT9m/k4KUlb1m0dKPHxGV8WbIK1/openlink_640x640s.jpg',
                    image_width: 640,
                    image_height: 640,
                    link: {
                        web_url: 'http://www.daum.net/contents/1',
                        mobile_web_url: 'http://m.daum.net/contents/1',
                        android_execution_params: '/contents/1',
                        ios_execution_params: '/contents/1',
                    },
                },
                {
                    title: '비쥬얼이 끝내주는 오레오 카푸치노',
                    description: '매거진',
                    image_url:
                        'https://mud-kage.kakao.com/dn/boVWEm/btqfFGlOpJB/mKsq9z6U2Xpms3NztZgiD1/openlink_640x640s.jpg',
                    image_width: 640,
                    image_height: 640,
                    link: {
                        web_url: 'http://www.daum.net/contents/2',
                        mobile_web_url: 'http://m.daum.net/contents/2',
                        android_execution_params: '/contents/2',
                        ios_execution_params: '/contents/2',
                    },
                },
                {
                    title: '감성이 가득한 분위기',
                    description: '매거진',
                    image_url:
                        'https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg',
                    image_width: 640,
                    image_height: 640,
                    link: {
                        web_url: 'http://www.daum.net/contents/3',
                        mobile_web_url: 'http://m.daum.net/contents/3',
                        android_execution_params: '/contents/3',
                        ios_execution_params: '/contents/3',
                    },
                },
            ],
            buttons: [
                {
                    title: '웹으로 이동',
                    link: {
                        web_url: 'http://www.daum.net',
                        mobile_web_url: 'http://m.daum.net',
                    },
                },
                {
                    title: '앱으로 이동',
                    link: {
                        android_execution_params: 'main',
                        ios_execution_params: 'main',
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
                console.log(response);
            } else {
                throw new UnauthorizedException();
            }
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException();
        }
    }
}
