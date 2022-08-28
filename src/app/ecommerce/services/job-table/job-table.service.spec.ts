import { TestBed, inject } from '@angular/core/testing';

import { JobTableService } from './job-table.service';

describe('JobTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobTableService]
    });
  });

  it('should be created', inject([JobTableService], (service: JobTableService) => {
    expect(service).toBeTruthy();
  }));
});
