import { TestBed, inject } from '@angular/core/testing';

import { AttchmentServiceService } from './attchment-service.service';

describe('AttchmentServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttchmentServiceService]
    });
  });

  it('should be created', inject([AttchmentServiceService], (service: AttchmentServiceService) => {
    expect(service).toBeTruthy();
  }));
});
