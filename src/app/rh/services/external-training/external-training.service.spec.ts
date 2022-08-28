import {inject, TestBed} from '@angular/core/testing';

import {ExternalTrainingService} from './external-training.service';

describe('ExternalTrainingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalTrainingService]
    });
  });

  it('should be created', inject([ExternalTrainingService], (service: ExternalTrainingService) => {
    expect(service).toBeTruthy();
  }));
});
