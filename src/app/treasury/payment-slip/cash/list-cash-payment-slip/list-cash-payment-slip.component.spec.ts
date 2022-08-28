import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCashPaymentSlipComponent } from './list-cash-payment-slip.component';

describe('ListCashPaymentSlipComponent', () => {
  let component: ListCashPaymentSlipComponent;
  let fixture: ComponentFixture<ListCashPaymentSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCashPaymentSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCashPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
