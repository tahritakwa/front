import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCustomerBankDraftComponent } from './wallet-customer-bank-draft.component';

describe('WalletCustomerBankDraftComponent', () => {
  let component: WalletCustomerBankDraftComponent;
  let fixture: ComponentFixture<WalletCustomerBankDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletCustomerBankDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCustomerBankDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
