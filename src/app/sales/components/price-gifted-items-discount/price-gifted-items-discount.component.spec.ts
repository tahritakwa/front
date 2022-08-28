import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceGiftedItemsDiscountComponent } from './price-gifted-items-discount.component';

describe('PriceGiftedItemsDiscountComponent', () => {
  let component: PriceGiftedItemsDiscountComponent;
  let fixture: ComponentFixture<PriceGiftedItemsDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceGiftedItemsDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceGiftedItemsDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
