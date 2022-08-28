import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCustomerBankCheckComponent } from './wallet-customer-bank-check.component';

describe('WalletCustomerBankCheckComponent', () => {
  let component: WalletCustomerBankCheckComponent;
  let fixture: ComponentFixture<WalletCustomerBankCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletCustomerBankCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCustomerBankCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
