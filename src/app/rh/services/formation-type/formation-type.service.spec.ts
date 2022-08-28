import {inject, TestBed} from '@angular/core/testing';

import {FormationTypeService} from './formation-type.service';

describe('FormationTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormationTypeService]
    });
  });

  it('should be created', inject([FormationTypeService], (service: FormationTypeService) => {
    expect(service).toBeTruthy();
  }));
});
