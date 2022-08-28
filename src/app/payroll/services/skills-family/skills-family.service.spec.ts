import {inject, TestBed} from '@angular/core/testing';

import {SkillsFamilyService} from './skills-family.service';

describe('SkillsFamilyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkillsFamilyService]
    });
  });

  it('should be created', inject([SkillsFamilyService], (service: SkillsFamilyService) => {
    expect(service).toBeTruthy();
  }));
});
