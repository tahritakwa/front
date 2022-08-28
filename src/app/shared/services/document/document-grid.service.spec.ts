import { TestBed, inject } from '@angular/core/testing';

import { DocumentFormService } from './document-grid.service';

describe('DocumentFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentFormService]
    });
  });

  it('should be created', inject([DocumentFormService], (service: DocumentFormService) => {
    expect(service).toBeTruthy();
  }));
});
