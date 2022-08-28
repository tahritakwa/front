import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionStateDropdownComponent } from './session-state-dropdown.component';

describe('SessionStateDropdownComponent', () => {
  let component: SessionStateDropdownComponent;
  let fixture: ComponentFixture<SessionStateDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionStateDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionStateDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
