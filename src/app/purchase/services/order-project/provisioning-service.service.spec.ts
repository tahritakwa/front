import { TestBed, inject } from '@angular/core/testing';

import { ProvisioningServiceService } from './provisioning-service.service';

describe('ProvisioningServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProvisioningServiceService]
    });
  });

  it('should be created', inject([ProvisioningServiceService], (service: ProvisioningServiceService) => {
    expect(service).toBeTruthy();
  }));
});
