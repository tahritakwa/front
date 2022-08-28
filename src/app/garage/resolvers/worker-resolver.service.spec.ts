import { TestBed, inject } from '@angular/core/testing';

import { WorkerResolverService } from './worker-resolver.service';

describe('WorkerResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkerResolverService]
    });
  });

  it('should be created', inject([WorkerResolverService], (service: WorkerResolverService) => {
    expect(service).toBeTruthy();
  }));
});
