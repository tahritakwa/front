import {inject, TestBed} from '@angular/core/testing';

import {TrainingRequestService} from './training-request.service';

describe('TrainingRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingRequestService]
    });
  });

  it('should be created', inject([TrainingRequestService], (service: TrainingRequestService) => {
    expect(service).toBeTruthy();
  }));
});
