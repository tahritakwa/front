import {inject, TestBed} from '@angular/core/testing';
import {EvaluationCriteriaThemeService} from './evaluation-criteria-theme.service';


describe('EvaluationCriteriaThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvaluationCriteriaThemeService]
    });
  });

  it('should be created', inject([EvaluationCriteriaThemeService], (service: EvaluationCriteriaThemeService) => {
    expect(service).toBeTruthy();
  }));
});
