import {inject, TestBed} from '@angular/core/testing';

import {ExpenseReportDetailsService} from './expense-report-details.service';

describe('ExpenseReportDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseReportDetailsService]
    });
  });

  it('should be created', inject([ExpenseReportDetailsService], (service: ExpenseReportDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
