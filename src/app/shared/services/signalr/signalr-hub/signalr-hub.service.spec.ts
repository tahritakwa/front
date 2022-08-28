import { TestBed, inject } from '@angular/core/testing';

import { SignalrHubService } from './signalr-hub.service';

describe('SignalrHubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalrHubService]
    });
  });

  it('should be created', inject([SignalrHubService], (service: SignalrHubService) => {
    expect(service).toBeTruthy();
  }));
});
