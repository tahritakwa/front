import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentSlipComponent } from './customer-payment-slip.component';

describe('CustomerPaymentSlipComponent', () => {
  let component: CustomerPaymentSlipComponent;
  let fixture: ComponentFixture<CustomerPaymentSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPaymentSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
