import { TestBed, inject } from '@angular/core/testing';

import { TaxAccountsResolverService } from './tax-accounts-resolver.service';

describe('AccountingConfigurationResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaxAccountsResolverService]
    });
  });

  it('should be created', inject([TaxAccountsResolverService], (service: TaxAccountsResolverService) => {
    expect(service).toBeTruthy();
  }));
});
