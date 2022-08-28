import { TestBed, inject } from '@angular/core/testing';

import { OrderProjectService } from './order-project.service';

describe('OrderProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderProjectService]
    });
  });

  it('should be created', inject([OrderProjectService], (service: OrderProjectService) => {
    expect(service).toBeTruthy();
  }));
});
