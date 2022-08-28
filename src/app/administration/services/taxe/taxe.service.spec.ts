import { TestBed, inject } from '@angular/core/testing';

import { TaxeService } from './taxe.service';

describe('TaxeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaxeService]
    });
  });

  it('should be created', inject([TaxeService], (service: TaxeService) => {
    expect(service).toBeTruthy();
  }));
});
