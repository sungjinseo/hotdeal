import { Module } from '@nestjs/common';
import { PpomppuService } from './ppomppu.service';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [PpomppuService],
    exports: [PpomppuService],
})
export class PpomppuModule {}
