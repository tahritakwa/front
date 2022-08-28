import { TestBed, inject } from '@angular/core/testing';

import { OemItemService } from './oem-item.service';

describe('OemItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OemItemService]
    });
  });

  it('should be created', inject([OemItemService], (service: OemItemService) => {
    expect(service).toBeTruthy();
  }));
});
