import {inject, TestBed} from '@angular/core/testing';

import {BaseSalaryService} from './base-salary.service';

describe('BaseSalaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseSalaryService]
    });
  });

  it('should be created', inject([BaseSalaryService], (service: BaseSalaryService) => {
    expect(service).toBeTruthy();
  }));
});
