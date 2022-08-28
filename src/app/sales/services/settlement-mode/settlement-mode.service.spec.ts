import { TestBed, inject } from '@angular/core/testing';

import { SettlementModeService } from './settlement-mode.service';

describe('SettlementModeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettlementModeService]
    });
  });

  it('should be created', inject([SettlementModeService], (service: SettlementModeService) => {
    expect(service).toBeTruthy();
  }));
});
