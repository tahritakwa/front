import { TestBed, inject } from '@angular/core/testing';

import { DetailOfService } from './detail-of.service';

describe('DetailOfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetailOfService]
    });
  });

  it('should be created', inject([DetailOfService], (service: DetailOfService) => {
    expect(service).toBeTruthy();
  }));
});
