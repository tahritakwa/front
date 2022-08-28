import {inject, TestBed} from '@angular/core/testing';

import {ReviewResumeService} from './review-resume.service';

describe('ReviewResumeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewResumeService]
    });
  });

  it('should be created', inject([ReviewResumeService], (service: ReviewResumeService) => {
    expect(service).toBeTruthy();
  }));
});
