import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesPriceComponent } from './add-sales-price.component';

describe('AddSalesPriceComponent', () => {
  let component: AddSalesPriceComponent;
  let fixture: ComponentFixture<AddSalesPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
