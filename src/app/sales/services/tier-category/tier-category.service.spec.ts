/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TierCategoryService } from './tier-category.service';

describe('Service: TierCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TierCategoryService]
    });
  });

  it('should ...', inject([TierCategoryService], (service: TierCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
