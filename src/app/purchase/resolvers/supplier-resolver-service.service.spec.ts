import { TestBed, inject } from '@angular/core/testing';

import { SupplierResolverServiceService } from './supplier-resolvers-service.service';

describe('TiersTypeResolverServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplierResolverServiceService]
    });
  });

  it('should be created', inject([SupplierResolverServiceService], (service: SupplierResolverServiceService) => {
    expect(service).toBeTruthy();
  }));
});
