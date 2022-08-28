import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionsDropdownComponent } from './user-actions-dropdown.component';

describe('UserActionsDropdownComponent', () => {
  let component: UserActionsDropdownComponent;
  let fixture: ComponentFixture<UserActionsDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserActionsDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
