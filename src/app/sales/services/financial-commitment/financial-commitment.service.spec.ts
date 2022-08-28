import { TestBed, inject } from '@angular/core/testing';

import { FinancialCommitmentService } from './financial-commitment.service';

describe('FinancialCommitmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinancialCommitmentService]
    });
  });

  it('should be created', inject([FinancialCommitmentService], (service: FinancialCommitmentService) => {
    expect(service).toBeTruthy();
  }));
});
