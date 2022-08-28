import { TestBed, inject } from '@angular/core/testing';

import { EmployeeProjectService } from './employee-project.service';

describe('EmployeeProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeProjectService]
    });
  });

  it('should be created', inject([EmployeeProjectService], (service: EmployeeProjectService) => {
    expect(service).toBeTruthy();
  }));
});
