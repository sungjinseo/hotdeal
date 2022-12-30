import { Module } from '@nestjs/common';
import { PpomppuService } from './ppomppu.service';

@Module({
    providers: [PpomppuService],
})
export class PpomppuModule {}
