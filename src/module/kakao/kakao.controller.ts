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
    // REDIRECT_URI = http://localhost:3000/kakao-callback
    // 위주소를 실행하면 callback로 로그인처리가 됨
    // 최초에만 동의가 뜨기때문에 혼자 만드는거면 서버킬때 해당 리퀘스트 한번 날려주자
    @Get('/kakao-callback')
    async kakaoLogin(@Query('code') code: string) {
        const domain = 'http://localhost:3000';
        if (this.appService.kakaoToken === undefined) {
            const kakao = await this.appService.kakaoLogin({ code, domain });
            if (!kakao.id) {
                throw new BadRequestException('카카오 정보가 없습니다.');
            }
        }
    }
}
