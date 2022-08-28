import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalesPriceComponent } from './list-sales-price.component';

describe('ListSalesPriceComponent', () => {
  let component: ListSalesPriceComponent;
  let fixture: ComponentFixture<ListSalesPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSalesPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalesPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
