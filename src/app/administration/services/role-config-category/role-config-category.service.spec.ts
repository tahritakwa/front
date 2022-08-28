import { TestBed, inject } from '@angular/core/testing';

import { RoleConfigCategoryService } from './role-config-category.service';

describe('RoleConfigCategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleConfigCategoryService]
    });
  });

  it('should be created', inject([RoleConfigCategoryService], (service: RoleConfigCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
