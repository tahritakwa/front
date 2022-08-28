import { TestBed, inject } from '@angular/core/testing';

import { InterventionOperationKitService } from './intervention-operation-kit.service';

describe('InterventionOperationKitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterventionOperationKitService]
    });
  });

  it('should be created', inject([InterventionOperationKitService], (service: InterventionOperationKitService) => {
    expect(service).toBeTruthy();
  }));
});
