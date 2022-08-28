import { TestBed, inject } from '@angular/core/testing';

import { ClaimStatusService } from './claim-status.service';

describe('ClaimStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimStatusService]
    });
  });

  it('should be created', inject([ClaimStatusService], (service: ClaimStatusService) => {
    expect(service).toBeTruthy();
  }));
});
