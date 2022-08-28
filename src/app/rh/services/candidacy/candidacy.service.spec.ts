import {inject, TestBed} from '@angular/core/testing';

import {CandidacyService} from './candidacy.service';

describe('CandidacyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CandidacyService]
    });
  });

  it('should be created', inject([CandidacyService], (service: CandidacyService) => {
    expect(service).toBeTruthy();
  }));
});
