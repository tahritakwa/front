import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidateLeaveUsersDetailsComponent} from './validate-leave-users-details.component';

describe('ValidateLeaveUsersDetailsComponent', () => {
  let component: ValidateLeaveUsersDetailsComponent;
  let fixture: ComponentFixture<ValidateLeaveUsersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateLeaveUsersDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateLeaveUsersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
