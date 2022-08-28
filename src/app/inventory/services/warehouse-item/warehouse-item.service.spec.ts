import { TestBed, inject } from '@angular/core/testing';

import { WarehouseItemService } from './warehouse-item.service';

describe('WarehouseItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WarehouseItemService]
    });
  });

  it('should be created', inject([WarehouseItemService], (service: WarehouseItemService) => {
    expect(service).toBeTruthy();
  }));
});
