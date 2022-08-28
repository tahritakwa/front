import { TestBed, inject } from '@angular/core/testing';

import { SettingsMailServiceService } from './settings-mail-service.service';

describe('SettingsMailServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsMailServiceService]
    });
  });

  it('should be created', inject([SettingsMailServiceService], (service: SettingsMailServiceService) => {
    expect(service).toBeTruthy();
  }));
});
