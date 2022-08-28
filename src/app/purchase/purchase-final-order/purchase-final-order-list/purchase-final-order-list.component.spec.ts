import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFinalOrderListComponent } from './purchase-final-order-list.component';

describe('PurchaseFinalOrderListComponent', () => {
  let component: PurchaseFinalOrderListComponent;
  let fixture: ComponentFixture<PurchaseFinalOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseFinalOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseFinalOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
