import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterSessionComponent } from './cash-register-session.component';

describe('CashRegisterSessionComponent', () => {
  let component: CashRegisterSessionComponent;
  let fixture: ComponentFixture<CashRegisterSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
