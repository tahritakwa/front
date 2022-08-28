import {inject, TestBed} from '@angular/core/testing';

import {ObjectiveService} from './objective.service';

describe('ObjectiveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectiveService]
    });
  });

  it('should be created', inject([ObjectiveService], (service: ObjectiveService) => {
    expect(service).toBeTruthy();
  }));
});
