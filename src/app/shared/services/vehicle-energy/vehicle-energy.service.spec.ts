import { TestBed, inject } from '@angular/core/testing';

import { VehicleEnergyService } from './vehicle-energy.service';

describe('VehicleEnergyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleEnergyService]
    });
  });

  it('should be created', inject([VehicleEnergyService], (service: VehicleEnergyService) => {
    expect(service).toBeTruthy();
  }));
});
