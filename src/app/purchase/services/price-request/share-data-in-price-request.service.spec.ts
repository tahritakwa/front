import { TestBed, inject } from '@angular/core/testing';

import { ShareDataInPriceRequestService } from './share-data-in-price-request.service';

describe('ShareDataInPriceRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareDataInPriceRequestService]
    });
  });

  it('should be created', inject([ShareDataInPriceRequestService], (service: ShareDataInPriceRequestService) => {
    expect(service).toBeTruthy();
  }));
});
