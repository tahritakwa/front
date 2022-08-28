import { TestBed, inject } from '@angular/core/testing';

import { NotificationCrmService } from './notification-crm.service';

describe('NotificationCrmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationCrmService]
    });
  });

  it('should be created', inject([NotificationCrmService], (service: NotificationCrmService) => {
    expect(service).toBeTruthy();
  }));
});
