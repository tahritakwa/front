import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceGiftedItemsDiscountListComponent } from './price-gifted-items-discount-list.component';

describe('PriceGiftedItemsDiscountListComponent', () => {
  let component: PriceGiftedItemsDiscountListComponent;
  let fixture: ComponentFixture<PriceGiftedItemsDiscountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceGiftedItemsDiscountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceGiftedItemsDiscountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
