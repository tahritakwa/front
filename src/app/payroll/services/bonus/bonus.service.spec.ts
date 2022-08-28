import {inject, TestBed} from '@angular/core/testing';

import {BonusesService} from './bonuses.service';

describe('BonusesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BonusesService]
    });
  });

  it('should be created', inject([BonusesService], (service: BonusesService) => {
    expect(service).toBeTruthy();
  }));
});
