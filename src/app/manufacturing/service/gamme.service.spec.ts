import { TestBed, inject } from '@angular/core/testing';

import { GammeService } from './gamme.service';

describe('GammeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GammeService]
    });
  });

  it('should be created', inject([GammeService], (service: GammeService) => {
    expect(service).toBeTruthy();
  }));
});
