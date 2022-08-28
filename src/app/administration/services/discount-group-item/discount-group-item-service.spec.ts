import { TestBed, inject } from '@angular/core/testing';

import { DiscountGroupItemServiceService } from './discount-group-item-service.service';

describe('DiscountGroupItemServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscountGroupItemServiceService]
    });
  });

  it('should be created', inject([DiscountGroupItemServiceService], (service: DiscountGroupItemServiceService) => {
    expect(service).toBeTruthy();
  }));
});
