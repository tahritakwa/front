import { TestBed, inject } from '@angular/core/testing';

import { UpdateServiceService } from './update-service.service';

describe('UpdateServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateServiceService]
    });
  });

  it('should be created', inject([UpdateServiceService], (service: UpdateServiceService) => {
    expect(service).toBeTruthy();
  }));
});
