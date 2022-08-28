import { TestBed, inject } from '@angular/core/testing';

import { CrmConfigurationService } from './crm-configuration.service';

describe('CrmConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrmConfigurationService]
    });
  });

  it('should be created', inject([CrmConfigurationService], (service: CrmConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
