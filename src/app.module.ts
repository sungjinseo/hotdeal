import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { KakaoModule } from './module/kakao/kakao.module';
import { ConfigModule } from '@nestjs/config';
import { PuppeteerModule } from './module/puppeteer/puppeteer.module';
import { PpomppuModule } from './module/ppomppu/ppomppu.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        HttpModule.registerAsync({
            useFactory: () => ({
                timeout: 5000,
                maxRedirects: 5,
            }),
        }),
        KakaoModule,
        PuppeteerModule,
        PpomppuModule,
    ],
    // provders에 module을 넣으니 자동으로 콜이 안됨...관계를 공부하자
    providers: [AppService],
})
export class AppModule {}
