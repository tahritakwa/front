import { TestBed, inject } from '@angular/core/testing';

import { ModulesSettingsService } from './modules-settings.service';

describe('ModulesSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModulesSettingsService]
    });
  });

  it('should be created', inject([ModulesSettingsService], (service: ModulesSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
