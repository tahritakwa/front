import { TestBed, inject } from '@angular/core/testing';

import { DiscountGroupTiersService } from './discount-group-tiers.service';

describe('DiscountGroupTiersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscountGroupTiersService]
    });
  });

  it('should be created', inject([DiscountGroupTiersService], (service: DiscountGroupTiersService) => {
    expect(service).toBeTruthy();
  }));
});
