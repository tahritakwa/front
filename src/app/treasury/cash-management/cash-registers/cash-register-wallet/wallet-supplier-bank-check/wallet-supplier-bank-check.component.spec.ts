import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletSupplierBankCheckComponent } from './wallet-supplier-bank-check.component';

describe('WalletSupplierBankCheckComponent', () => {
  let component: WalletSupplierBankCheckComponent;
  let fixture: ComponentFixture<WalletSupplierBankCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletSupplierBankCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletSupplierBankCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
