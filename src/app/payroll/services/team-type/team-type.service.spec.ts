import {inject, TestBed} from '@angular/core/testing';

import {TeamTypeService} from './team-type.service';

describe('TeamTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamTypeService]
    });
  });

  it('should be created', inject([TeamTypeService], (service: TeamTypeService) => {
    expect(service).toBeTruthy();
  }));
});
