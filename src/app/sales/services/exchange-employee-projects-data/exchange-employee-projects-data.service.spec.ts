import { TestBed, inject } from '@angular/core/testing';

import { ExchangeEmployeeProjectsDataService } from './exchange-employee-projects-data.service';

describe('ExchangeEmployeeProjectsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExchangeEmployeeProjectsDataService]
    });
  });

  it('should be created', inject([ExchangeEmployeeProjectsDataService], (service: ExchangeEmployeeProjectsDataService) => {
    expect(service).toBeTruthy();
  }));
});
