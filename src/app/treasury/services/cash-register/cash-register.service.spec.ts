import { TestBed, inject } from '@angular/core/testing';

import { CashRegisterService } from './cash-register.service';

describe('CashRegisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashRegisterService]
    });
  });

  it('should be created', inject([CashRegisterService], (service: CashRegisterService) => {
    expect(service).toBeTruthy();
  }));
});
