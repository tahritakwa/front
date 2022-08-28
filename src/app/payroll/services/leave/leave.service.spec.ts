import {inject, TestBed} from '@angular/core/testing';
import {LeaveService} from './leave.service';


describe('PurchaseRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveService]
    });
  });

  it('should be created', inject([LeaveService], (service: LeaveService) => {
    expect(service).toBeTruthy();
  }));
});
