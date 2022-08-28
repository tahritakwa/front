import { TestBed, inject } from '@angular/core/testing';

import { OperationTypeService } from './operation-type.service';

describe('OperationTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationTypeService]
    });
  });

  it('should be created', inject([OperationTypeService], (service: OperationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
