import { TestBed, inject } from '@angular/core/testing';

import { TemplateEmailSideNavService } from './template-email-side-nav.service';

describe('TemplateEmailSideNavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateEmailSideNavService]
    });
  });

  it('should be created', inject([TemplateEmailSideNavService], (service: TemplateEmailSideNavService) => {
    expect(service).toBeTruthy();
  }));
});
