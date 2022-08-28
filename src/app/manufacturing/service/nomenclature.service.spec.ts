import { TestBed, inject } from '@angular/core/testing';

import { NomenclatureService } from './nomenclature.service';

describe('NomenclatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NomenclatureService]
    });
  });

  it('should be created', inject([NomenclatureService], (service: NomenclatureService) => {
    expect(service).toBeTruthy();
  }));
});
