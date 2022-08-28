import { TestBed, inject } from '@angular/core/testing';

import { OperationCashService } from './operation-cash.service';

describe('OperationCashService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationCashService]
    });
  });

  it('should be created', inject([OperationCashService], (service: OperationCashService) => {
    expect(service).toBeTruthy();
  }));
});
