import { TestBed, inject } from '@angular/core/testing';

import { GarageSettingsService } from './garage-settings.service';

describe('GarageSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GarageSettingsService]
    });
  });

  it('should be created', inject([GarageSettingsService], (service: GarageSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
