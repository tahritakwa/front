import {inject, TestBed} from '@angular/core/testing';

import {EmployeeDocumentService} from './employee-document.service';

describe('EmployeeDocumentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeDocumentService]
    });
  });

  it('should be created', inject([EmployeeDocumentService], (service: EmployeeDocumentService) => {
    expect(service).toBeTruthy();
  }));
});
