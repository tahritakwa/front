import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterSettlementComponent } from './cash-register-settlement.component';

describe('CashRegisterSettlementComponent', () => {
  let component: CashRegisterSettlementComponent;
  let fixture: ComponentFixture<CashRegisterSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
