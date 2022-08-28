import { TestBed, inject } from '@angular/core/testing';

import { ListDocumentService } from './list-document.service';

describe('ListDocumentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListDocumentService]
    });
  });

  it('should be created', inject([ListDocumentService], (service: ListDocumentService) => {
    expect(service).toBeTruthy();
  }));
});
