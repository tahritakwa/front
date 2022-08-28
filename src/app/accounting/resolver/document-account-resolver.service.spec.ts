import { TestBed, inject } from '@angular/core/testing';

import { DocumentAccountResolverService } from './document-account-resolver.service';

describe('DocumentAccountResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentAccountResolverService]
    });
  });

  it('should be created', inject([DocumentAccountResolverService], (service: DocumentAccountResolverService) => {
    expect(service).toBeTruthy();
  }));
});
