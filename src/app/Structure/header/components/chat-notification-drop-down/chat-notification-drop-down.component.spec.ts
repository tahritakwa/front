import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNotificationDropDownComponent } from './chat-notification-drop-down.component';

describe('ChatNotificationDropDownComponent', () => {
  let component: ChatNotificationDropDownComponent;
  let fixture: ComponentFixture<ChatNotificationDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatNotificationDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatNotificationDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
