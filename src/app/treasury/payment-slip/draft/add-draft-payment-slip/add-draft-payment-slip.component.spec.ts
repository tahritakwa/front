import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDraftPaymentSlipComponent } from './add-draft-payment-slip.component';

describe('AddDraftPaymentSlipComponent', () => {
  let component: AddDraftPaymentSlipComponent;
  let fixture: ComponentFixture<AddDraftPaymentSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDraftPaymentSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDraftPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
