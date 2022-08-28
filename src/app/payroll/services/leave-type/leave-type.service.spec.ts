import {inject, TestBed} from '@angular/core/testing';

import {LeaveTypeService} from './leave-type.service';

describe('LeaveTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveTypeService]
    });
  });

  it('should be created', inject([LeaveTypeService], (service: LeaveTypeService) => {
    expect(service).toBeTruthy();
  }));
});
