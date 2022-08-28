import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderEventComponent } from './reminder-event.component';

describe('ReminderEventComponent', () => {
  let component: ReminderEventComponent;
  let fixture: ComponentFixture<ReminderEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
