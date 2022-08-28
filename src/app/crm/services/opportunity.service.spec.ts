import { TestBed, inject } from '@angular/core/testing';

import { OpportunityService } from './opportunity.service';

describe('OpportunityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpportunityService]
    });
  });

  it('should be created', inject([OpportunityService], (service: OpportunityService) => {
    expect(service).toBeTruthy();
  }));
});
