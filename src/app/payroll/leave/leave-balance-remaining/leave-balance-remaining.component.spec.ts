import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LeaveBalanceRemainingComponent} from './leave-balance-remaining.component';

describe('LeaveBalanceRemainingComponent', () => {
  let component: LeaveBalanceRemainingComponent;
  let fixture: ComponentFixture<LeaveBalanceRemainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveBalanceRemainingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveBalanceRemainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
