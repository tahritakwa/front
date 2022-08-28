import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterTicketComponent } from './cash-register-ticket.component';

describe('CashRegisterTicketComponent', () => {
  let component: CashRegisterTicketComponent;
  let fixture: ComponentFixture<CashRegisterTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
