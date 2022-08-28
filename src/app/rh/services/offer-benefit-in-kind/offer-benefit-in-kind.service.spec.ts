import {inject, TestBed} from '@angular/core/testing';

import {OfferBenefitInKindService} from './offer-benefit-in-kind.service';

describe('OfferBenefitInKindService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfferBenefitInKindService]
    });
  });

  it('should be created', inject([OfferBenefitInKindService], (service: OfferBenefitInKindService) => {
    expect(service).toBeTruthy();
  }));
});
