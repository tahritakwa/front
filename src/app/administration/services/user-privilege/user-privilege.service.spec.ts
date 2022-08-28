import { TestBed, inject } from '@angular/core/testing';

import { UserPrivilegeService } from './user-privilege.service';

describe('UserPrivilegeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserPrivilegeService]
    });
  });

  it('should be created', inject([UserPrivilegeService], (service: UserPrivilegeService) => {
    expect(service).toBeTruthy();
  }));
});
