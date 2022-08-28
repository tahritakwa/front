import {inject, TestBed} from '@angular/core/testing';

import {ExpenseReportDetailsTypeService} from './expense-report-details-type.service';

describe('ExpenseReportDetailsTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseReportDetailsTypeService]
    });
  });

  it('should be created', inject([ExpenseReportDetailsTypeService], (service: ExpenseReportDetailsTypeService) => {
    expect(service).toBeTruthy();
  }));
});
