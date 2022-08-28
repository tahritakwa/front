import { TestBed, inject } from '@angular/core/testing';

import { DocumentExpenseLineService } from './document-expense-line.service';

describe('DocumentExpenseLineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentExpenseLineService]
    });
  });

  it('should be created', inject([DocumentExpenseLineService], (service: DocumentExpenseLineService) => {
    expect(service).toBeTruthy();
  }));
});
