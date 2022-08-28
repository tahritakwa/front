import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCashRegisterSessionComponent } from './open-cash-register-session.component';

describe('OpenCashRegisterSessionComponent', () => {
  let component: OpenCashRegisterSessionComponent;
  let fixture: ComponentFixture<OpenCashRegisterSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenCashRegisterSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenCashRegisterSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
