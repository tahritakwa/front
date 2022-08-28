import {inject, TestBed} from '@angular/core/testing';

import {TimesheetValidationService} from './timesheet-validation.service';

describe('TimesheetValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimesheetValidationService]
    });
  });

  it('should be created', inject([TimesheetValidationService], (service: TimesheetValidationService) => {
    expect(service).toBeTruthy();
  }));
});
