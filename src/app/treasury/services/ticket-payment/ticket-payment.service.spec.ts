import { TestBed, inject } from '@angular/core/testing';

import { TicketPaymentService } from './ticket-payment.service';

describe('TicketPaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicketPaymentService]
    });
  });

  it('should be created', inject([TicketPaymentService], (service: TicketPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
