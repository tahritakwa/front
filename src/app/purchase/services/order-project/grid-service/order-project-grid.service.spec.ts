import { TestBed, inject } from '@angular/core/testing';

import { OrderProjectGridService } from './order-project-grid.service';

describe('OrderProjectGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderProjectGridService]
    });
  });

  it('should be created', inject([OrderProjectGridService], (service: OrderProjectGridService) => {
    expect(service).toBeTruthy();
  }));
});
