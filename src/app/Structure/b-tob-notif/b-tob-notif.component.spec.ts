import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BTobNotifComponent } from './b-tob-notif.component';

describe('BTobNotifComponent', () => {
  let component: BTobNotifComponent;
  let fixture: ComponentFixture<BTobNotifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BTobNotifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BTobNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
