import {inject, TestBed} from '@angular/core/testing';

import {ContractBenefitInKindService} from './contract-benefit-in-kind.service';

describe('ContractBenefitInKindService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractBenefitInKindService]
    });
  });

  it('should be created', inject([ContractBenefitInKindService], (service: ContractBenefitInKindService) => {
    expect(service).toBeTruthy();
  }));
});
