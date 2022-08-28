import {inject, TestBed} from '@angular/core/testing';

import {ExitEmployeeService} from './exit-employee.service';

describe('LeaveEmployeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExitEmployeeService]
    });
  });

  it('should be created', inject([ExitEmployeeService], (service: ExitEmployeeService) => {
    expect(service).toBeTruthy();
  }));
});
