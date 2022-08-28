import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentSlipComponent } from './add-payment-slip.component';

describe('AddPaymentSlipComponent', () => {
  let component: AddPaymentSlipComponent;
  let fixture: ComponentFixture<AddPaymentSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaymentSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
