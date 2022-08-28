import { TestBed, inject } from '@angular/core/testing';

import { DeliveryTypeService } from './delivery-type.service';

describe('DeliveryTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryTypeService]
    });
  });

  it('should be created', inject([DeliveryTypeService], (service: DeliveryTypeService) => {
    expect(service).toBeTruthy();
  }));
});
