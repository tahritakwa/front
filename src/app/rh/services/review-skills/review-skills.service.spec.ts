import {inject, TestBed} from '@angular/core/testing';

import {ReviewSkillsService} from './review-skills.service';

describe('ReviewSkillsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewSkillsService]
    });
  });

  it('should be created', inject([ReviewSkillsService], (service: ReviewSkillsService) => {
    expect(service).toBeTruthy();
  }));
});
