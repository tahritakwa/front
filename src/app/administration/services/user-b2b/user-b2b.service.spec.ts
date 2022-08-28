import { TestBed, inject } from '@angular/core/testing';

import { UserB2bService } from './user-b2b.service';

describe('UserB2bService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserB2bService]
    });
  });

  it('should be created', inject([UserB2bService], (service: UserB2bService) => {
    expect(service).toBeTruthy();
  }));
});
