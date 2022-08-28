import { TestBed, inject } from '@angular/core/testing';
import { PriceRequestService } from './PriceRequestService';

describe('PriceRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceRequestService]
    });
  });

  it('should be created', inject([PriceRequestService], (service: PriceRequestService) => {
    expect(service).toBeTruthy();
  }));
});
