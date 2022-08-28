import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderSmsListComponent } from './reminder-sms-list.component';

describe('ReminderSmsListComponent', () => {
  let component: ReminderSmsListComponent;
  let fixture: ComponentFixture<ReminderSmsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderSmsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderSmsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
