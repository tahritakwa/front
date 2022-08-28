import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusDropdownComponent } from './payment-status-dropdown.component';

describe('PaymentStatusDropdownComponent', () => {
  let component: PaymentStatusDropdownComponent;
  let fixture: ComponentFixture<PaymentStatusDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentStatusDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStatusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
