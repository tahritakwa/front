import { TestBed, inject } from '@angular/core/testing';

import { SuccessHandlerService } from './success-handler.service';

describe('SuccessHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuccessHandlerService]
    });
  });

  it('should be created', inject([SuccessHandlerService], (service: SuccessHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
