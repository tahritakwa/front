import { TestBed, inject } from '@angular/core/testing';

import { StockDocumentsService } from './stock-documents.service';

describe('StockDocumentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockDocumentsService]
    });
  });

  it('should be created', inject([StockDocumentsService], (service: StockDocumentsService) => {
    expect(service).toBeTruthy();
  }));
});
