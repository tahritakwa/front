import { TestBed, inject } from '@angular/core/testing';

import { MailingService } from './mailing.service';

describe('MailingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailingService]
    });
  });

  it('should be created', inject([MailingService], (service: MailingService) => {
    expect(service).toBeTruthy();
  }));
});
