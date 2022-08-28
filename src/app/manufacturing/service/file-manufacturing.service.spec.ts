import { TestBed, inject } from '@angular/core/testing';

import { FileManufacturingService } from './file-manufacturing.service';

describe('FileManufacturingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileManufacturingService]
    });
  });

  it('should be created', inject([FileManufacturingService], (service: FileManufacturingService) => {
    expect(service).toBeTruthy();
  }));
});
