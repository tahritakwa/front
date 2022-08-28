import { TestBed, inject } from '@angular/core/testing';

import { ReminderEventService } from './reminder-event.service';

describe('ReminderEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReminderEventService]
    });
  });

  it('should be created', inject([ReminderEventService], (service: ReminderEventService) => {
    expect(service).toBeTruthy();
  }));
});
