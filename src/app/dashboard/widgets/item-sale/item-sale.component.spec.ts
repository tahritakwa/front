import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSaleComponent } from './item-sale.component';

describe('ItemSaleComponent', () => {
  let component: ItemSaleComponent;
  let fixture: ComponentFixture<ItemSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
