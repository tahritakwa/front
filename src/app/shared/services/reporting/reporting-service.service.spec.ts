import { TestBed, inject } from '@angular/core/testing';

import { ReportingServiceService } from './reporting-service.service';

describe('ReportingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportingServiceService]
    });
  });

  it('should be created', inject([ReportingServiceService], (service: ReportingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
