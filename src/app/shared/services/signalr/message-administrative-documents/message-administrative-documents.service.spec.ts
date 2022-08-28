import { TestBed, inject } from '@angular/core/testing';

import { MessageAdministrativeDocumentsService } from './message-administrative-documents.service';

describe('MessageAdministrativeDocumentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageAdministrativeDocumentsService]
    });
  });

  it('should be created', inject([MessageAdministrativeDocumentsService], (service: MessageAdministrativeDocumentsService) => {
    expect(service).toBeTruthy();
  }));
});
