import { TestBed, inject } from '@angular/core/testing';

import { SettingsMailService } from './settings-mail-service';

describe('SettingsMailServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsMailService]
    });
  });

  it('should be created', inject([SettingsMailService], (service: SettingsMailService) => {
    expect(service).toBeTruthy();
  }));
});
