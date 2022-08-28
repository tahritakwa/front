import {inject, TestBed} from '@angular/core/testing';

import {TrainingCenterRoomService} from './training-center-room.service';

describe('TrainingCenterRoomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingCenterRoomService]
    });
  });

  it('should be created', inject([TrainingCenterRoomService], (service: TrainingCenterRoomService) => {
    expect(service).toBeTruthy();
  }));
});
