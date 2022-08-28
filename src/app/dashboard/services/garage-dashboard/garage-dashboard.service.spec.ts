import { TestBed, inject } from '@angular/core/testing';

import { GarageDashboardService } from './garage-dashboard.service';

describe('GarageDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GarageDashboardService]
    });
  });

  it('should be created', inject([GarageDashboardService], (service: GarageDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
