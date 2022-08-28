import {inject, TestBed} from '@angular/core/testing';

import {QualificationTypeService} from './qualification-type.service';

describe('QualificationTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QualificationTypeService]
    });
  });

  it('should be created', inject([QualificationTypeService], (service: QualificationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
