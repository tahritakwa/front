import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDraftPaymentSlipComponent } from './list-draft-payment-slip.component';

describe('ListDraftPaymentSlipComponent', () => {
  let component: ListDraftPaymentSlipComponent;
  let fixture: ComponentFixture<ListDraftPaymentSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDraftPaymentSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDraftPaymentSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
