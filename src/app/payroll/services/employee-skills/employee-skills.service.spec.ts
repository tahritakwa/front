import {inject, TestBed} from '@angular/core/testing';

import {EmployeeSkillsService} from './employee-skills.service';

describe('EmployeeSkillsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeSkillsService]
    });
  });

  it('should be created', inject([EmployeeSkillsService], (service: EmployeeSkillsService) => {
    expect(service).toBeTruthy();
  }));
});
