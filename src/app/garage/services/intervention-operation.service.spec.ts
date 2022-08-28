import { TestBed, inject } from '@angular/core/testing';

import { InterventionOperationService } from './intervention-operation.service';

describe('InterventionOperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterventionOperationService]
    });
  });

  it('should be created', inject([InterventionOperationService], (service: InterventionOperationService) => {
    expect(service).toBeTruthy();
  }));
});
