import {inject, TestBed} from '@angular/core/testing';

import {ExitEmployeeLeaveService} from './exit-employee-leave.service';

describe('ExitEmployeeLeaveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExitEmployeeLeaveService]
    });
  });

  it('should be created', inject([ExitEmployeeLeaveService], (service: ExitEmployeeLeaveService) => {
    expect(service).toBeTruthy();
  }));
});
