import { TestBed, inject } from '@angular/core/testing';

import { OrganisationSideNavService } from './organisation-side-nav.service';

describe('OrganisationSideNavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganisationSideNavService]
    });
  });

  it('should be created', inject([OrganisationSideNavService], (service: OrganisationSideNavService) => {
    expect(service).toBeTruthy();
  }));
});
