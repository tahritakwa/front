import {inject, TestBed} from '@angular/core/testing';

import {ReviewFormationService} from './review-formation.service';

describe('ReviewFormationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewFormationService]
    });
  });

  it('should be created', inject([ReviewFormationService], (service: ReviewFormationService) => {
    expect(service).toBeTruthy();
  }));
});
