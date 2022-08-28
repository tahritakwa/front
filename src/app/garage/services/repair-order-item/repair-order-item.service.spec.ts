import { TestBed, inject } from '@angular/core/testing';

import { RepairOrderItemService } from './repair-order-item.service';

describe('RepairOrderItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairOrderItemService]
    });
  });

  it('should be created', inject([RepairOrderItemService], (service: RepairOrderItemService) => {
    expect(service).toBeTruthy();
  }));
});
