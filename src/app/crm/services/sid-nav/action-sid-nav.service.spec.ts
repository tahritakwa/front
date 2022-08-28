import { TestBed, inject } from '@angular/core/testing';

import { ActionSidNavService } from './action-sid-nav.service';

describe('ActionSidNavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionSidNavService]
    });
  });

  it('should be created', inject([ActionSidNavService], (service: ActionSidNavService) => {
    expect(service).toBeTruthy();
  }));
});
