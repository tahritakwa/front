import { TestBed, inject } from '@angular/core/testing';

import { DetailOperationService } from './detail-operation.service';

describe('DetailOperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetailOperationService]
    });
  });

  it('should be created', inject([DetailOperationService], (service: DetailOperationService) => {
    expect(service).toBeTruthy();
  }));
});
