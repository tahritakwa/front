import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSlipMenuComponent } from './payment-slip-menu.component';

describe('PaymentSlipMenuComponent', () => {
  let component: PaymentSlipMenuComponent;
  let fixture: ComponentFixture<PaymentSlipMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSlipMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSlipMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
