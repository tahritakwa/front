import {inject, TestBed} from '@angular/core/testing';

import {ContractBonusService} from './contract-bonus.service';

describe('ContractBonusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractBonusService]
    });
  });

  it('should be created', inject([ContractBonusService], (service: ContractBonusService) => {
    expect(service).toBeTruthy();
  }));
});
