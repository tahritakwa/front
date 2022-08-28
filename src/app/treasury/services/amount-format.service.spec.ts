import { TestBed, inject } from '@angular/core/testing';

import { AmountFormatService } from './amount-format.service';

describe('AmountFormatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmountFormatService]
    });
  });

  it('should be created', inject([AmountFormatService], (service: AmountFormatService) => {
    expect(service).toBeTruthy();
  }));
});
