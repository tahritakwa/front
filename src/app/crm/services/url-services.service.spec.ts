import { TestBed, inject } from '@angular/core/testing';

import { UrlServicesService } from './url-services.service';

describe('UrlServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlServicesService]
    });
  });

  it('should be created', inject([UrlServicesService], (service: UrlServicesService) => {
    expect(service).toBeTruthy();
  }));
});
