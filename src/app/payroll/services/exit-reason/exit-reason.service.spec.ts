import {ExitReasonService} from './exit-reason.service';
import {inject, TestBed} from '@angular/core/testing';

describe('ExitReasonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExitReasonService]
    });
  });

  it('should be created', inject([ExitReasonService], (service: ExitReasonService) => {
    expect(service).toBeTruthy();
  }));
});
