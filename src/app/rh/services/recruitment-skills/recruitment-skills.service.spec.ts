import {inject, TestBed} from '@angular/core/testing';
import {RecruitmentSkillsService} from './recruitment-skills.service';

describe('RecruitmentSkillsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecruitmentSkillsService]
    });
  });

  it('should be created', inject(
    [RecruitmentSkillsService],
    (service: RecruitmentSkillsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
