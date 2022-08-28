import {inject, TestBed} from '@angular/core/testing';

import {ExitEmployeePayServiceService} from './exit-employee-pay-service.service';

describe('ExitEmployeePayServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExitEmployeePayServiceService]
    });
  });

  it('should be created', inject([ExitEmployeePayServiceService], (service: ExitEmployeePayServiceService) => {
    expect(service).toBeTruthy();
  }));
});
