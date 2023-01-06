import {
    Controller,
    Get,
    Post,
    Query,
    Res,
    Body,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { KakaoService } from './kakao.service';

@Controller()
export class KakaoController {
    constructor(private readonly appService: KakaoService) {}

    // https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}
    // https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=http://localhost:3000/kakao-callback&response_type=code&scope=talk_message
    // REDIRECT_URI = http://localhost:3000/kakao-callback
    // 위주소를 실행하면 callback로 로그인처리가 됨
    // 최초에만 동의가 뜨기때문에 혼자 만드는거면 서버킬때 해당 리퀘스트 한번 날려주자
    // 401 받으면 권한에 대한 문제가 발생한거다
    @Get('/kakao-callback')
    async kakaoLogin(@Query('code') code: string) {
        const domain = 'http://localhost:3000';
        if (this.appService.accessToken === undefined) {
            const kakao = await this.appService.kakaoLogin({ code, domain });
            console.log(kakao);
        }
    }
}
