import { TestBed, inject } from '@angular/core/testing';

import { DocumentUtilityService } from './document-utility.service';

describe('DocumentUtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentUtilityService]
    });
  });

  it('should be created', inject([DocumentUtilityService], (service: DocumentUtilityService) => {
    expect(service).toBeTruthy();
  }));
});
