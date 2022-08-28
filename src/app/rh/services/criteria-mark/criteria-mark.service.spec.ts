import {inject, TestBed} from '@angular/core/testing';

import {CriteriaMarkService} from './criteria-mark.service';

describe('CriteriaMarkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CriteriaMarkService]
    });
  });

  it('should be created', inject([CriteriaMarkService], (service: CriteriaMarkService) => {
    expect(service).toBeTruthy();
  }));
});
