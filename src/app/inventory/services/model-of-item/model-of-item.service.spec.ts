import { TestBed, inject } from '@angular/core/testing';

import { ModelOfItemService } from './model-of-item.service';

describe('ModelOfItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelOfItemService]
    });
  });

  it('should be created', inject([ModelOfItemService], (service: ModelOfItemService) => {
    expect(service).toBeTruthy();
  }));
});
