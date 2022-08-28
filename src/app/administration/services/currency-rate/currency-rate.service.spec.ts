import { TestBed, inject } from '@angular/core/testing';

import { CurrencyRateService } from './currency-rate.service';

describe('CurrencyRateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyRateService]
    });
  });

  it('should be created', inject([CurrencyRateService], (service: CurrencyRateService) => {
    expect(service).toBeTruthy();
  }));
});
