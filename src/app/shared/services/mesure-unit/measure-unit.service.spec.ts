import { TestBed, inject } from '@angular/core/testing';

import { MeasureUnitService } from './measure-unit.service';

describe('MeasureUnitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeasureUnitService]
    });
  });

  it('should be created', inject([MeasureUnitService], (service: MeasureUnitService) => {
    expect(service).toBeTruthy();
  }));
});
