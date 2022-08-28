import { TestBed, inject } from '@angular/core/testing';

import { SalesSettingsService } from './sales-settings.service';

describe('SalesSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesSettingsService]
    });
  });

  it('should be created', inject([SalesSettingsService], (service: SalesSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
