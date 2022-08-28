import { TestBed, inject } from '@angular/core/testing';

import { ActiveAssignmentService } from './active-assignment.service';

describe('ActiveAssignmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveAssignmentService]
    });
  });

  it('should be created', inject([ActiveAssignmentService], (service: ActiveAssignmentService) => {
    expect(service).toBeTruthy();
  }));
});
