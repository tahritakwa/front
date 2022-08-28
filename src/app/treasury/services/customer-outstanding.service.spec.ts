import { TestBed, inject } from '@angular/core/testing';

import { CustomerOutstandingService } from './customer-outstanding.service';

describe('CustomerOutstandingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerOutstandingService]
    });
  });

  it('should be created', inject([CustomerOutstandingService], (service: CustomerOutstandingService) => {
    expect(service).toBeTruthy();
  }));
});
