import { TestBed, inject } from '@angular/core/testing';

import { CustomerPartsService } from './customer-parts.service';

describe('CustomerPartsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerPartsService]
    });
  });

  it('should be created', inject([CustomerPartsService], (service: CustomerPartsService) => {
    expect(service).toBeTruthy();
  }));
});
