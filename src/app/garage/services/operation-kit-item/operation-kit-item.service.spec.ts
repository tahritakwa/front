import { TestBed, inject } from '@angular/core/testing';

import { OperationKitItemService } from './operation-kit-item.service';

describe('OperationKitItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationKitItemService]
    });
  });

  it('should be created', inject([OperationKitItemService], (service: OperationKitItemService) => {
    expect(service).toBeTruthy();
  }));
});
