import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactivateUsersDetailsComponent } from './desactivate-users-details.component';

describe('DesactivateUsersDetailsComponent', () => {
  let component: DesactivateUsersDetailsComponent;
  let fixture: ComponentFixture<DesactivateUsersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesactivateUsersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesactivateUsersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
