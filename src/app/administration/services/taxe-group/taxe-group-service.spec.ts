import { TestBed, inject } from '@angular/core/testing';

import { TaxeGroupService } from './taxe-group.service';

describe('TaxeGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaxeGroupService]
    });
  });

  it('should be created', inject([TaxeGroupService], (service: TaxeGroupService) => {
    expect(service).toBeTruthy();
  }));
});
