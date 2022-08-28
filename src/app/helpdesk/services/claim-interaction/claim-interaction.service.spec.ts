import { TestBed, inject } from '@angular/core/testing';

import { ClaimInteractionService } from './claim-interaction.service';

describe('ClaimInteractionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimInteractionService]
    });
  });

  it('should be created', inject([ClaimInteractionService], (service: ClaimInteractionService) => {
    expect(service).toBeTruthy();
  }));
});
