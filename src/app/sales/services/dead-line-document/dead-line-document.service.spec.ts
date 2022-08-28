import { TestBed, inject } from '@angular/core/testing';

import { DeadLineDocumentService } from './dead-line-document.service';

describe('DeadLineDocumentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeadLineDocumentService]
    });
  });

  it('should be created', inject([DeadLineDocumentService], (service: DeadLineDocumentService) => {
    expect(service).toBeTruthy();
  }));
});
