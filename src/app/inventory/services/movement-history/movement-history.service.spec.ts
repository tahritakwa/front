import { TestBed, inject } from '@angular/core/testing';

import { MovementHistoryService } from './movement-history.service';

describe('MovementHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovementHistoryService]
    });
  });

  it('should be created', inject([MovementHistoryService], (service: MovementHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
