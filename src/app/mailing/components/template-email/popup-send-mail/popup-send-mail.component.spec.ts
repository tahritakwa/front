import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSendMailComponent } from './popup-send-mail.component';

describe('PopupSendMailComponent', () => {
  let component: PopupSendMailComponent;
  let fixture: ComponentFixture<PopupSendMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupSendMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupSendMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
