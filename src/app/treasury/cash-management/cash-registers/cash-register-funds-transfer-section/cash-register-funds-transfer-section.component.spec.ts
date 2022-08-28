import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterFundsTransferSectionComponent } from './cash-register-funds-transfer-section.component';

describe('CashRegisterFundsTransferSectionComponent', () => {
  let component: CashRegisterFundsTransferSectionComponent;
  let fixture: ComponentFixture<CashRegisterFundsTransferSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterFundsTransferSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterFundsTransferSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
