import {inject, TestBed} from '@angular/core/testing';

import {TrainingCenterManagerService} from './training-center-manager.service';

describe('TrainingCenterManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingCenterManagerService]
    });
  });

  it('should be created', inject([TrainingCenterManagerService], (service: TrainingCenterManagerService) => {
    expect(service).toBeTruthy();
  }));
});
