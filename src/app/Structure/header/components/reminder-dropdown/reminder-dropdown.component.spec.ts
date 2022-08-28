import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderDropdownComponent } from './reminder-dropdown.component';

describe('ReminderDropdownComponent', () => {
  let component: ReminderDropdownComponent;
  let fixture: ComponentFixture<ReminderDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
