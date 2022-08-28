import { TestBed, inject } from '@angular/core/testing';

import { WithholdingTaxService } from './withholding-tax.service';

describe('WithholdingTaxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WithholdingTaxService]
    });
  });

  it('should be created', inject([WithholdingTaxService], (service: WithholdingTaxService) => {
    expect(service).toBeTruthy();
  }));
});
