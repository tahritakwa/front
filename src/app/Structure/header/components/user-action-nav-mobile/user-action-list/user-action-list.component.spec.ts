import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionListComponent } from './user-action-list.component';

describe('UserActionListComponent', () => {
  let component: UserActionListComponent;
  let fixture: ComponentFixture<UserActionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserActionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
