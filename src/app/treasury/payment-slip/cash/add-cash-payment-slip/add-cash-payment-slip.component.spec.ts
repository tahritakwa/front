import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashPaymentSlipComponent } from './add-cash-payment-slip.component';

describe('AddCashPaymentSlipComponent', () => {
  let component: AddCashPaymentSlipComponent;
  let fixture: ComponentFixture<AddCashPaymentSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCashPaymentSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCashPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
