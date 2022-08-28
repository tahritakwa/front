import { TestBed, inject } from '@angular/core/testing';

import { GarageResolverService } from './garage-resolver.service';

describe('GarageResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GarageResolverService]
    });
  });

  it('should be created', inject([GarageResolverService], (service: GarageResolverService) => {
    expect(service).toBeTruthy();
  }));
});
