import { TestBed, inject } from '@angular/core/testing';

import { KendoGridTranslationService } from './kendo-grid-translation.service';

describe('KendoGridTranslationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KendoGridTranslationService]
    });
  });

  it('should be created', inject([KendoGridTranslationService], (service: KendoGridTranslationService) => {
    expect(service).toBeTruthy();
  }));
});
