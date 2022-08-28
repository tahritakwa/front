import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletSupplierBankDraftComponent } from './wallet-supplier-bank-draft.component';

describe('WalletSupplierBankDraftComponent', () => {
  let component: WalletSupplierBankDraftComponent;
  let fixture: ComponentFixture<WalletSupplierBankDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletSupplierBankDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletSupplierBankDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
