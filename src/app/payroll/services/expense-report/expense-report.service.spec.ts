import {inject, TestBed} from '@angular/core/testing';

import {ExpenseReportService} from './expense-report.service';

describe('ExpenseReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseReportService]
    });
  });

  it('should be created', inject([ExpenseReportService], (service: ExpenseReportService) => {
    expect(service).toBeTruthy();
  }));
});
