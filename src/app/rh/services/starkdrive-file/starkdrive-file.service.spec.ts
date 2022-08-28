import {inject, TestBed} from '@angular/core/testing';

import {StarkdriveFileService} from './starkdrive-file.service';

describe('StarkdriveFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarkdriveFileService]
    });
  });

  it('should be created', inject([StarkdriveFileService], (service: StarkdriveFileService) => {
    expect(service).toBeTruthy();
  }));
});
