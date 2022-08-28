import { TestBed, inject } from '@angular/core/testing';

import { VehicleBrandService } from './vehicle-brand.service';

describe('VehicleBrandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleBrandService]
    });
  });

  it('should be created', inject([VehicleBrandService], (service: VehicleBrandService) => {
    expect(service).toBeTruthy();
  }));
});
