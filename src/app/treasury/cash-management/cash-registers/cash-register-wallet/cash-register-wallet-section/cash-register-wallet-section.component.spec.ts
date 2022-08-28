import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterWalletSectionComponent } from './cash-register-wallet-section.component';

describe('CashRegisterWalletSectionComponent', () => {
  let component: CashRegisterWalletSectionComponent;
  let fixture: ComponentFixture<CashRegisterWalletSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterWalletSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterWalletSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
