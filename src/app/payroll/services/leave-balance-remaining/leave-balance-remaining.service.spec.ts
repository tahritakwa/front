import {inject, TestBed} from '@angular/core/testing';

import {LeaveBalanceRemainingService} from './leave-balance-remaining.service';

describe('LeaveBalanceRemainingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveBalanceRemainingService]
    });
  });

  it('should be created', inject([LeaveBalanceRemainingService], (service: LeaveBalanceRemainingService) => {
    expect(service).toBeTruthy();
  }));
});
