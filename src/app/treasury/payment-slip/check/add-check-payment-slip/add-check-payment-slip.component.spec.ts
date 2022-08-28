import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCheckPaymentSlipComponent } from './add-check-payment-slip.component';


describe('AddCheckPaymentSlipComponent', () => {
  let component: AddCheckPaymentSlipComponent;
  let fixture: ComponentFixture<AddCheckPaymentSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCheckPaymentSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCheckPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
