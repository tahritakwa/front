import { TestBed, inject } from '@angular/core/testing';

import { TecdocService } from './tecdoc.service';

describe('TecdocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TecdocService]
    });
  });

  it('should be created', inject([TecdocService], (service: TecdocService) => {
    expect(service).toBeTruthy();
  }));
});
