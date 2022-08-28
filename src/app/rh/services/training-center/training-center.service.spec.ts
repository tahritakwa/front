import {inject, TestBed} from '@angular/core/testing';

import {TrainingCenterService} from './training-center.service';

describe('TrainingCenterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingCenterService]
    });
  });

  it('should be created', inject([TrainingCenterService], (service: TrainingCenterService) => {
    expect(service).toBeTruthy();
  }));
});
