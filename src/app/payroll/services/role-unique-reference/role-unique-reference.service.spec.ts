import {inject, TestBed} from '@angular/core/testing';

import {RoleUniqueReferenceService} from './role-unique-reference.service';

describe('RoleUniqueReferenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleUniqueReferenceService]
    });
  });

  it('should be created', inject([RoleUniqueReferenceService], (service: RoleUniqueReferenceService) => {
    expect(service).toBeTruthy();
  }));
});
