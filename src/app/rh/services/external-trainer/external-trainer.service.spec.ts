import {inject, TestBed} from '@angular/core/testing';

import {ExternalTrainerService} from './external-trainer.service';

describe('ExternalTrainerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalTrainerService]
    });
  });

  it('should be created', inject([ExternalTrainerService], (service: ExternalTrainerService) => {
    expect(service).toBeTruthy();
  }));
});
