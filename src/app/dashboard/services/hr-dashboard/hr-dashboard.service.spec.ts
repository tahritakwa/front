import { TestBed, inject } from '@angular/core/testing';

import { HrDashboardService } from './hr-dashboard.service';

describe('HrDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HrDashboardService]
    });
  });

  it('should be created', inject([HrDashboardService], (service: HrDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
