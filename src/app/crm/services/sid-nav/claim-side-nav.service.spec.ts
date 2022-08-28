import { TestBed, inject } from '@angular/core/testing';

import { ClaimSideNavService } from './claim-side-nav.service';

describe('ClaimSideNavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimSideNavService]
    });
  });

  it('should be created', inject([ClaimSideNavService], (service: ClaimSideNavService) => {
    expect(service).toBeTruthy();
  }));
});
