import { TestBed, inject } from '@angular/core/testing';

import { OperationKitOperationService } from './operation-kit-operation.service';

describe('OperationKitOperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationKitOperationService]
    });
  });

  it('should be created', inject([OperationKitOperationService], (service: OperationKitOperationService) => {
    expect(service).toBeTruthy();
  }));
});
