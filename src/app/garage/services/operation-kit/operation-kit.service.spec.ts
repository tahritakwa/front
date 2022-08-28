import { TestBed, inject } from '@angular/core/testing';

import { OperationKitService } from './operation-kit.service';

describe('OperationKitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationKitService]
    });
  });

  it('should be created', inject([OperationKitService], (service: OperationKitService) => {
    expect(service).toBeTruthy();
  }));
});
