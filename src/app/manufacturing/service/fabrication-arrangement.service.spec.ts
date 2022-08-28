import { TestBed, inject } from '@angular/core/testing';

import { FabricationArrangementService } from './fabrication-arrangement.service';

describe('FabricationArrangementServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FabricationArrangementService]
    });
  });

  it('should be created', inject([FabricationArrangementService], (service: FabricationArrangementService) => {
    expect(service).toBeTruthy();
  }));
});
