import { TestBed, inject } from '@angular/core/testing';

import { PurchaseSettingsService } from './purchase-settings.service';

describe('PurchaseSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchaseSettingsService]
    });
  });

  it('should be created', inject([PurchaseSettingsService], (service: PurchaseSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
