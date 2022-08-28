import { TestBed, inject } from '@angular/core/testing';

import { PriceRequestDetailService } from './price-request-detail.service';

describe('PriceRequestDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceRequestDetailService]
    });
  });

  it('should be created', inject([PriceRequestDetailService], (service: PriceRequestDetailService) => {
    expect(service).toBeTruthy();
  }));
});
