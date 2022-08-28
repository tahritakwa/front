import {inject, TestBed} from '@angular/core/testing';

import {EvaluationCriteriaService} from './evaluation-criteria.service';

describe('EvaluationCriteriaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvaluationCriteriaService]
    });
  });

  it('should be created', inject([EvaluationCriteriaService], (service: EvaluationCriteriaService) => {
    expect(service).toBeTruthy();
  }));
});
