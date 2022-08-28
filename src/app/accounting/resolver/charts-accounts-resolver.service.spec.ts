import { TestBed, inject } from '@angular/core/testing';

import { ChartsAccountsResolverService } from './charts-accounts-resolver.service';

describe('ChartsAccountsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartsAccountsResolverService]
    });
  });

  it('should be created', inject([ChartsAccountsResolverService], (service: ChartsAccountsResolverService) => {
    expect(service).toBeTruthy();
  }));
});
