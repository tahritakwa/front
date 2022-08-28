import { TestBed, inject } from '@angular/core/testing';

import { RepairOrderService } from './repair-order.service';

describe('RepairOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairOrderService]
    });
  });

  it('should be created', inject([RepairOrderService], (service: RepairOrderService) => {
    expect(service).toBeTruthy();
  }));
});
