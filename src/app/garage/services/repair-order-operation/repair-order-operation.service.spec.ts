import { TestBed, inject } from '@angular/core/testing';

import { RepairOrderOperationService } from './repair-order-operation.service';

describe('RepairOrderOperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairOrderOperationService]
    });
  });

  it('should be created', inject([RepairOrderOperationService], (service: RepairOrderOperationService) => {
    expect(service).toBeTruthy();
  }));
});
