import { TestBed, inject } from '@angular/core/testing';

import { FundsTransferService } from './funds-transfer.service';

describe('FundsTransferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FundsTransferService]
    });
  });

  it('should be created', inject([FundsTransferService], (service: FundsTransferService) => {
    expect(service).toBeTruthy();
  }));
});
