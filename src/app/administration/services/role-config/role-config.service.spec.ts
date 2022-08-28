import { TestBed, inject } from '@angular/core/testing';

import { RoleConfigService } from './role-config.service';

describe('RoleConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleConfigService]
    });
  });

  it('should be created', inject([RoleConfigService], (service: RoleConfigService) => {
    expect(service).toBeTruthy();
  }));
});
