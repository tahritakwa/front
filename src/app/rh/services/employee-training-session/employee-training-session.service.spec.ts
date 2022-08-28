import {inject, TestBed} from '@angular/core/testing';

import {EmployeeTrainingSessionService} from './employee-training-session.service';

describe('EmployeeTrainingSessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeTrainingSessionService]
    });
  });

  it('should be created', inject([EmployeeTrainingSessionService], (service: EmployeeTrainingSessionService) => {
    expect(service).toBeTruthy();
  }));
});
