import { TestBed, inject } from '@angular/core/testing';

import { TiersResolverService } from './tiers-resolver.service';

describe('TiersResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TiersResolverService]
    });
  });

  it('should be created', inject([TiersResolverService], (service: TiersResolverService) => {
    expect(service).toBeTruthy();
  }));
});
