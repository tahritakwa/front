import { TestBed, inject } from '@angular/core/testing';

import { MachineSpareService } from './machine-spare.service';

describe('MachineSpareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineSpareService]
    });
  });

  it('should be created', inject([MachineSpareService], (service: MachineSpareService) => {
    expect(service).toBeTruthy();
  }));
});
