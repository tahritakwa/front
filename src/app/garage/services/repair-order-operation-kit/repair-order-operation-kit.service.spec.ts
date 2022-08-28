import { TestBed, inject } from '@angular/core/testing';

import { RepairOrderOperationKitService } from './repair-order-operation-kit.service';

describe('RepairOrderOperationKitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairOrderOperationKitService]
    });
  });

  it('should be created', inject([RepairOrderOperationKitService], (service: RepairOrderOperationKitService) => {
    expect(service).toBeTruthy();
  }));
});
