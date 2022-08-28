import {inject, TestBed} from '@angular/core/testing';

import {MobilityRequestService} from './mobility-request.service';

describe('MobilityRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MobilityRequestService]
    });
  });

  it('should be created', inject([MobilityRequestService], (service: MobilityRequestService) => {
    expect(service).toBeTruthy();
  }));
});
