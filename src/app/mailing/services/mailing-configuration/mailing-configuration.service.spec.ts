import { TestBed, inject } from '@angular/core/testing';

import { MailingConfigurationService } from './mailing-configuration.service';

describe('MailingConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailingConfigurationService]
    });
  });

  it('should be created', inject([MailingConfigurationService], (service: MailingConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
