import { TestBed, inject } from '@angular/core/testing';

import { InterventionLoanVehicleService } from './intervention-loan-vehicle.service';

describe('InterventionLoanVehicleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterventionLoanVehicleService]
    });
  });

  it('should be created', inject([InterventionLoanVehicleService], (service: InterventionLoanVehicleService) => {
    expect(service).toBeTruthy();
  }));
});
