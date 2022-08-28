import {inject, TestBed} from '@angular/core/testing';

import {JobSkillsService} from './job-skills.service';

describe('JobSkillsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobSkillsService]
    });
  });

  it('should be created', inject([JobSkillsService], (service: JobSkillsService) => {
    expect(service).toBeTruthy();
  }));
});
