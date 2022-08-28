import { TestBed, inject } from '@angular/core/testing';

import { BTobService } from './b-tob.service';

describe('BTobService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BTobService]
    });
  });

  it('should be created', inject([BTobService], (service: BTobService) => {
    expect(service).toBeTruthy();
  }));
});
