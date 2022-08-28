import { TestBed, inject } from '@angular/core/testing';

import { SubModelService } from './sub-model.service';

describe('SubModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubModelService]
    });
  });

  it('should be created', inject([SubModelService], (service: SubModelService) => {
    expect(service).toBeTruthy();
  }));
});
