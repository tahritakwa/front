import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendReminderSmsComponent } from './send-remider-sms.component';
 

describe('SendReminderSmsComponent', () => {
  let component: SendReminderSmsComponent;
  let fixture: ComponentFixture<SendReminderSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendReminderSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReminderSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
