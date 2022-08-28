import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderForPriceRequestComponent } from './purchase-order-for-price-request.component';

describe('PurchaseOrderForPriceRequestComponent', () => {
  let component: PurchaseOrderForPriceRequestComponent;
  let fixture: ComponentFixture<PurchaseOrderForPriceRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderForPriceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderForPriceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
