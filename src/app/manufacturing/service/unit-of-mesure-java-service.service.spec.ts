import { TestBed, inject } from '@angular/core/testing';

import { UnitOfMesureJavaServiceService } from './unit-of-mesure-java-service.service';

describe('UnitOfMesureJavaServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitOfMesureJavaServiceService]
    });
  });

  it('should be created', inject([UnitOfMesureJavaServiceService], (service: UnitOfMesureJavaServiceService) => {
    expect(service).toBeTruthy();
  }));
});
