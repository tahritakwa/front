import {inject, TestBed} from '@angular/core/testing';

import {TrainingSeanceService} from './training-seance.service';

describe('TrainingSeanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingSeanceService]
    });
  });

  it('should be created', inject([TrainingSeanceService], (service: TrainingSeanceService) => {
    expect(service).toBeTruthy();
  }));
});
