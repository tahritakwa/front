import { TestBed, inject } from '@angular/core/testing';

import { EcommerceProductService } from './ecommerce-product.service';

describe('EcommerceProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcommerceProductService]
    });
  });

  it('should be created', inject([EcommerceProductService], (service: EcommerceProductService) => {
    expect(service).toBeTruthy();
  }));
});
