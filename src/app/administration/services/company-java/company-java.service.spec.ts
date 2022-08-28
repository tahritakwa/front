import { TestBed, inject } from '@angular/core/testing';

import { CompanyJavaService } from './company-java.service';

describe('CompanyJavaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyJavaService]
    });
  });

  it('should be created', inject([CompanyJavaService], (service: CompanyJavaService) => {
    expect(service).toBeTruthy();
  }));
});
