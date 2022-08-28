import { TestBed, inject } from '@angular/core/testing';

import { DocumentWithholdingTaxService } from './document-withholding-tax.service';

describe('DocumentWithholdingTaxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentWithholdingTaxService]
    });
  });

  it('should be created', inject([DocumentWithholdingTaxService], (service: DocumentWithholdingTaxService) => {
    expect(service).toBeTruthy();
  }));
});
