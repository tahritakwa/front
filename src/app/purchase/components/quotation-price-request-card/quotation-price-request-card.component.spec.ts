import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationPriceRequestCardComponent } from './quotation-price-request-card.component';

describe('QuotationPriceRequestCardComponent', () => {
  let component: QuotationPriceRequestCardComponent;
  let fixture: ComponentFixture<QuotationPriceRequestCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationPriceRequestCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationPriceRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
