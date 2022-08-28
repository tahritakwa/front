import { TestBed, inject } from '@angular/core/testing';

import { DocumentExpenseGridLineService } from './document-expense-grid-line.service';

describe('DocumentExpenseGridLineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentExpenseGridLineService]
    });
  });

  it('should be created', inject([DocumentExpenseGridLineService], (service: DocumentExpenseGridLineService) => {
    expect(service).toBeTruthy();
  }));
});
