import { TestBed, inject } from '@angular/core/testing';

import { EmployeeResolverServiceService } from './employee-resolver-service.service';

describe('EmployeeResolverServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeResolverServiceService]
    });
  });

  it('should be created', inject([EmployeeResolverServiceService], (service: EmployeeResolverServiceService) => {
    expect(service).toBeTruthy();
  }));
});
