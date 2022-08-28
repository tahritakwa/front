import { TestBed, inject } from '@angular/core/testing';

import { MarkingEventItemsService } from './marking-event-items.service';

describe('MarkingEventItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkingEventItemsService]
    });
  });

  it('should be created', inject([MarkingEventItemsService], (service: MarkingEventItemsService) => {
    expect(service).toBeTruthy();
  }));
});
