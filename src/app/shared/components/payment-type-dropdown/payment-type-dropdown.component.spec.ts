import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeDropdownComponent } from './payment-type-dropdown.component';

describe('PaymentTypeDropdownComponent', () => {
  let component: PaymentTypeDropdownComponent;
  let fixture: ComponentFixture<PaymentTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
