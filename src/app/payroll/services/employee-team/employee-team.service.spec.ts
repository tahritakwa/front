import {inject, TestBed} from '@angular/core/testing';

import {EmployeeTeamService} from './employee-team.service';

describe('EmployeeTeamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeTeamService]
    });
  });

  it('should be created', inject([EmployeeTeamService], (service: EmployeeTeamService) => {
    expect(service).toBeTruthy();
  }));
});
