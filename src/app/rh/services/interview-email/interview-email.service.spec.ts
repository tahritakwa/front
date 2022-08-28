import {inject, TestBed} from '@angular/core/testing';

import {InterviewEmailService} from './interview-email.service';

describe('InterviewEmailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterviewEmailService]
    });
  });

  it('should be created', inject([InterviewEmailService], (service: InterviewEmailService) => {
    expect(service).toBeTruthy();
  }));
});
