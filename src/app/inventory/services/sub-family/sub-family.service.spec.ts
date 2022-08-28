import { TestBed, inject } from '@angular/core/testing';

import { SubFamilyService } from './sub-family.service';

describe('SubFamilyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubFamilyService]
    });
  });

  it('should be created', inject([SubFamilyService], (service: SubFamilyService) => {
    expect(service).toBeTruthy();
  }));
});
