import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpFinancialCommitmentPaymentHistoryComponent } from './pop-up-financial-commitment-payment-history.component';

describe('PopUpFinancialCommitmentPaymentHistoryComponent', () => {
  let component: PopUpFinancialCommitmentPaymentHistoryComponent;
  let fixture: ComponentFixture<PopUpFinancialCommitmentPaymentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpFinancialCommitmentPaymentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpFinancialCommitmentPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
