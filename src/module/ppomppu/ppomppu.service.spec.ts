import { Test, TestingModule } from '@nestjs/testing';
import { PpomppuService } from './ppomppu.service';

describe('PpomppuService', () => {
    let service: PpomppuService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PpomppuService],
        }).compile();

        service = module.get<PpomppuService>(PpomppuService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
