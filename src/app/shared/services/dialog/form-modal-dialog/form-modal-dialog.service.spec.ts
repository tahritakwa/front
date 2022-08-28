import { TestBed, inject } from '@angular/core/testing';

import { FormModalDialogService } from './form-modal-dialog.service';

describe('FormModalDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormModalDialogService]
    });
  });

  it('should be created', inject([FormModalDialogService], (service: FormModalDialogService) => {
    expect(service).toBeTruthy();
  }));
});
