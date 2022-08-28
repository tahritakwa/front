import {inject, TestBed} from '@angular/core/testing';

import {BenefitInKindService} from './benefit-in-kind.service';

describe('BenefitInKindService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BenefitInKindService]
    });
  });

  it('should be created', inject([BenefitInKindService], (service: BenefitInKindService) => {
    expect(service).toBeTruthy();
  }));
});
