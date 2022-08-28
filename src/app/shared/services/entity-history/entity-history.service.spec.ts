import { TestBed, inject } from '@angular/core/testing';

import { EntityHistoryService } from './entity-history.service';

describe('EntityHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntityHistoryService]
    });
  });

  it('should be created', inject([EntityHistoryService], (service: EntityHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
