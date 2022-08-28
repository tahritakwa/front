import {inject, TestBed} from '@angular/core/testing';

import {RecruitmentService} from './recruitment.service';

describe('RecruitmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecruitmentService]
    });
  });

  it('should be created', inject([RecruitmentService], (service: RecruitmentService) => {
    expect(service).toBeTruthy();
  }));
});
