import { TestBed, inject } from '@angular/core/testing';

import { ClaimTypeService } from './claim-type.service';

describe('ClaimTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimTypeService]
    });
  });

  it('should be created', inject([ClaimTypeService], (service: ClaimTypeService) => {
    expect(service).toBeTruthy();
  }));
});
