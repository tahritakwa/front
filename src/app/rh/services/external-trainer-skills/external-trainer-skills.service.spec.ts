import {inject, TestBed} from '@angular/core/testing';

import {ExternalTrainerSkillsService} from './external-trainer-skills.service';

describe('ExternalTrainerSkillsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalTrainerSkillsService]
    });
  });

  it('should be created', inject([ExternalTrainerSkillsService], (service: ExternalTrainerSkillsService) => {
    expect(service).toBeTruthy();
  }));
});
