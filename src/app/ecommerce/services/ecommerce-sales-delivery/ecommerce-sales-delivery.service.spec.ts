import { TestBed, inject } from '@angular/core/testing';

import { EcommerceSalesDeliveryService } from './ecommerce-sales-delivery.service';

describe('EcommerceSalesDeliveryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcommerceSalesDeliveryService]
    });
  });

  it('should be created', inject([EcommerceSalesDeliveryService], (service: EcommerceSalesDeliveryService) => {
    expect(service).toBeTruthy();
  }));
});
