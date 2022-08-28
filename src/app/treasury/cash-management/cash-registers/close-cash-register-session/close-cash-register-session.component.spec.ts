import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseCashRegisterSessionComponent } from './close-cash-register-session.component';

describe('CloseCashRegisterSessionComponent', () => {
  let component: CloseCashRegisterSessionComponent;
  let fixture: ComponentFixture<CloseCashRegisterSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseCashRegisterSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseCashRegisterSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
