import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModeAddComponent } from './payment-mode-add.component';

describe('PaymentModeAddComponent', () => {
  let component: PaymentModeAddComponent;
  let fixture: ComponentFixture<PaymentModeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentModeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
