import { TestBed, inject } from '@angular/core/testing';

import { BillingSessionService } from './billing-session.service';

describe('BillingSessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillingSessionService]
    });
  });

  it('should be created', inject([BillingSessionService], (service: BillingSessionService) => {
    expect(service).toBeTruthy();
  }));
});
