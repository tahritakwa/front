import {inject, TestBed} from '@angular/core/testing';

import {SharedDocumentService} from './shared-document.service';

describe('SharedDocumentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedDocumentService]
    });
  });

  it('should be created', inject([SharedDocumentService], (service: SharedDocumentService) => {
    expect(service).toBeTruthy();
  }));
});
