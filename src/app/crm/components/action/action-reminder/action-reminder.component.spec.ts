import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionReminderComponent } from './action-reminder.component';

describe('ActionReminderComponent', () => {
  let component: ActionReminderComponent;
  let fixture: ComponentFixture<ActionReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
