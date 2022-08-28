import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCheckPaymentSlipComponent } from './list-check-payment-slip.component';

describe('ListCheckPaymentSlipComponent', () => {
  let component: ListCheckPaymentSlipComponent;
  let fixture: ComponentFixture<ListCheckPaymentSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCheckPaymentSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCheckPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
