import {inject, TestBed} from '@angular/core/testing';

import {InterviewTypeService} from './interview-type.service';

describe('InterviewTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterviewTypeService]
    });
  });

  it('should be created', inject([InterviewTypeService], (service: InterviewTypeService) => {
    expect(service).toBeTruthy();
  }));
});
