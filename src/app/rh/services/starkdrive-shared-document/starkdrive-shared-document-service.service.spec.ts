import {inject, TestBed} from '@angular/core/testing';

import {StarkdriveSharedDocumentServiceService} from './starkdrive-shared-document-service.service';

describe('StarkdriveSharedDocumentServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarkdriveSharedDocumentServiceService]
    });
  });

  it('should be created', inject([StarkdriveSharedDocumentServiceService], (service: StarkdriveSharedDocumentServiceService) => {
    expect(service).toBeTruthy();
  }));
});
