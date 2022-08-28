import { TestBed, inject } from '@angular/core/testing';

import { CustomerResolverService } from './customer-resolver.service';

describe('CustomerResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerResolverService]
    });
  });

  it('should be created', inject([CustomerResolverService], (service: CustomerResolverService) => {
    expect(service).toBeTruthy();
  }));
});
