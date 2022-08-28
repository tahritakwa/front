import {inject, TestBed} from '@angular/core/testing';

import {QualificationService} from './qualification/qualification.service';

describe('QualificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QualificationService]
    });
  });

  it('should be created', inject([QualificationService], (service: QualificationService) => {
    expect(service).toBeTruthy();
  }));
});
