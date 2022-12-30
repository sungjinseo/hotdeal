import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PpomppuModule } from './module/ppomppu/ppomppu.module';
import { PpomppuService } from './module/ppomppu/ppomppu.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        HttpModule.registerAsync({
            useFactory: () => ({
                timeout: 5000,
                maxRedirects: 5,
            }),
        }),
    ],
    // provders에 module을 넣으니 자동으로 콜이 안됨...관계를 공부하자
    providers: [PpomppuService],
})
export class AppModule {}
