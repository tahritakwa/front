import { TestBed, inject } from '@angular/core/testing';

import { SharedEcommerceService } from './shared-ecommerce.service';

describe('SharedEcommerceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedEcommerceService]
    });
  });

  it('should be created', inject([SharedEcommerceService], (service: SharedEcommerceService) => {
    expect(service).toBeTruthy();
  }));
});
