import { TestBed, inject } from '@angular/core/testing';

import { EcommerceCustomerService } from './ecommerce-customer.service';

describe('EcommerceCustomerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcommerceCustomerService]
    });
  });

  it('should be created', inject([EcommerceCustomerService], (service: EcommerceCustomerService) => {
    expect(service).toBeTruthy();
  }));
});
