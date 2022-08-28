import {inject, TestBed} from '@angular/core/testing';

import {ContractTypeService} from './contract-type.service';

describe('ContractTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractTypeService]
    });
  });

  it('should be created', inject([ContractTypeService], (service: ContractTypeService) => {
    expect(service).toBeTruthy();
  }));
});
