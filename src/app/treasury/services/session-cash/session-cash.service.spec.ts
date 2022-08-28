import { TestBed, inject } from '@angular/core/testing';

import { SessionCashService } from './session-cash.service';

describe('SessionCashService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionCashService]
    });
  });

  it('should be created', inject([SessionCashService], (service: SessionCashService) => {
    expect(service).toBeTruthy();
  }));
});
