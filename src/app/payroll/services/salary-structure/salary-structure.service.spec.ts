import {inject, TestBed} from '@angular/core/testing';

import {SalaryStructureService} from './salary-structure.service';

describe('SalaryStructureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalaryStructureService]
    });
  });

  it('should be created', inject([SalaryStructureService], (service: SalaryStructureService) => {
    expect(service).toBeTruthy();
  }));
});
