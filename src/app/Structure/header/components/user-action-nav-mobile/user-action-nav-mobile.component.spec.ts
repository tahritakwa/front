import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionNavMobileComponent } from './user-action-nav-mobile.component';

describe('UserActionMobileComponent', () => {
  let component: UserActionNavMobileComponent;
  let fixture: ComponentFixture<UserActionNavMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserActionNavMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActionNavMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
