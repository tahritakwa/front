import {inject, TestBed} from '@angular/core/testing';

import {InterviewMarkService} from './interview-mark.service';

describe('InterviewMarkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterviewMarkService]
    });
  });

  it('should be created', inject([InterviewMarkService], (service: InterviewMarkService) => {
    expect(service).toBeTruthy();
  }));
});
