import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSlipStatusDropdownComponent } from './payment-slip-status-dropdown.component';

describe('PaymentSlipStatusDropdownComponent', () => {
  let component: PaymentSlipStatusDropdownComponent;
  let fixture: ComponentFixture<PaymentSlipStatusDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSlipStatusDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSlipStatusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
