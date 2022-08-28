import { TestBed, inject } from '@angular/core/testing';

import { ImportDocumentService } from './import-document.service';

describe('ImportDocumentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportDocumentService]
    });
  });

  it('should be created', inject([ImportDocumentService], (service: ImportDocumentService) => {
    expect(service).toBeTruthy();
  }));
});
