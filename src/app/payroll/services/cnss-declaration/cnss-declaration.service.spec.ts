import {inject, TestBed} from '@angular/core/testing';

import {CnssDeclarationService} from './cnss-declaration.service';

describe('CnssDeclarationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CnssDeclarationService]
    });
  });

  it('should be created', inject([CnssDeclarationService], (service: CnssDeclarationService) => {
    expect(service).toBeTruthy();
  }));
});
