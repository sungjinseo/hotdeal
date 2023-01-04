import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as config from 'config';
import qs from 'querystring';

@Injectable()
export class KakaoService {
    private _kakaoToken;

    get kakaoToken(): string {
        return this._kakaoToken;
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
                this._kakaoToken = response.data.access_token;
                console.log(`kakaoToken : ${JSON.stringify(response.data)}`);
                // Token 을 가져왔을 경우 사용자 정보 조회
                const headerUserInfo = {
                    'Content-Type':
                        'application/x-www-form-urlencoded;charset=utf-8',
                    Authorization: 'Bearer ' + response.data.access_token,
                };
                console.log(`url : ${kakaoTokenUrl}`);
                console.log(`headers : ${JSON.stringify(headerUserInfo)}`);
                const responseUserInfo = await axios({
                    method: 'GET',
                    url: kakaoUserInfoUrl,
                    timeout: 30000,
                    headers: headerUserInfo,
                });
                console.log(
                    `responseUserInfo.status : ${responseUserInfo.status}`,
                );
                if (responseUserInfo.status === 200) {
                    console.log(
                        `kakaoUserInfo : ${JSON.stringify(
                            responseUserInfo.data,
                        )}`,
                    );
                    return responseUserInfo.data;
                } else {
                    throw new UnauthorizedException();
                }
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
            header_title: 'Google',
            header_link: {
                web_url: 'www.google.com',
                mobile_web_url: 'www.google.com',
            },
            contents: [
                {
                    title: '1. 국립공원 뉴스',
                    description: '검색어: national park',
                    image_url:
                        'https://cdn.kado.net/news/photo/201901/948844_399953_0825.jpg',
                    image_width: 50,
                    image_height: 50,
                    link: {
                        web_url:
                            'https://www.google.co.kr/search?q=national+park&source=lnms&tbm=nws',
                        mobile_web_url:
                            'https://www.google.co.kr/search?q=national+park&source=lnms&tbm=nws',
                    },
                },
                {
                    title: '2. 딥러닝 뉴스',
                    description: '검색어: deep learning',
                    image_url:
                        'https://cdn-images-1.medium.com/max/1200/1*iDQvKoz7gGHc6YXqvqWWZQ.png',
                    image_width: 50,
                    image_height: 50,
                    link: {
                        web_url:
                            'https://www.google.co.kr/search?q=deep+learning&source=lnms&tbm=nws',
                        mobile_web_url:
                            'https://www.google.co.kr/search?q=deep+learning&source=lnms&tbm=nws',
                    },
                },
            ],
            buttons: [
                {
                    title: 'Google로 이동',
                    link: {
                        web_url: 'www.google.com',
                        mobile_web_url: 'www.google.com',
                    },
                },
            ],
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + this._kakaoToken,
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
