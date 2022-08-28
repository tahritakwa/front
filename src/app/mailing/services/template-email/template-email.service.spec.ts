import { TestBed, inject } from '@angular/core/testing';

import { TemplateEmailService } from './template-email.service';

describe('TemplateEmailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateEmailService]
    });
  });

  it('should be created', inject([TemplateEmailService], (service: TemplateEmailService) => {
    expect(service).toBeTruthy();
  }));
});
