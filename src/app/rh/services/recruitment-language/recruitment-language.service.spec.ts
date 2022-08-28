import {inject, TestBed} from '@angular/core/testing';
import {RecruitmentLanguageService} from './recruitment-language.service';

describe('RecruitmentLanguageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecruitmentLanguageService]
    });
  });

  it('should be created', inject(
    [RecruitmentLanguageService],
    (service: RecruitmentLanguageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
