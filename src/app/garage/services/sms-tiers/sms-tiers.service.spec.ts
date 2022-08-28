import { TestBed, inject } from '@angular/core/testing';

import { SmsTiersService } from './sms-tiers.service';

describe('SmsTiersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmsTiersService]
    });
  });

  it('should be created', inject([SmsTiersService], (service: SmsTiersService) => {
    expect(service).toBeTruthy();
  }));
});
