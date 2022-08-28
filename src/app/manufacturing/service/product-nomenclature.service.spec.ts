import { TestBed, inject } from '@angular/core/testing';

import { ProductNomenclatureService } from './product-nomenclature.service';

describe('ProductNomenclatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductNomenclatureService]
    });
  });

  it('should be created', inject([ProductNomenclatureService], (service: ProductNomenclatureService) => {
    expect(service).toBeTruthy();
  }));
});
