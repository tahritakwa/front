import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPaymentSlipComponent } from './list-payment-slip.component';

describe('ListPaymentSlipComponent', () => {
  let component: ListPaymentSlipComponent;
  let fixture: ComponentFixture<ListPaymentSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPaymentSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
