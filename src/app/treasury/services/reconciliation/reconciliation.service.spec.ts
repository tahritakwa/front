import { TestBed, inject } from '@angular/core/testing';

import { ReconciliationService } from './reconciliation.service';

describe('ReconciliationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReconciliationService]
    });
  });

  it('should be created', inject([ReconciliationService], (service: ReconciliationService) => {
    expect(service).toBeTruthy();
  }));
});
