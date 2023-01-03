import { Module } from '@nestjs/common';
import { PpomppuService } from './ppomppu.service';
import { KakaoService } from '../kakao/kakao.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [KakaoService],
    providers: [PpomppuService],
})
export class PpomppuModule {}
