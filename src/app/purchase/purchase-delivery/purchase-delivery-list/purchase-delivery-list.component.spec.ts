import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDeliveryListComponent } from './purchase-delivery-list.component';

describe('PurchaseDeliveryListComponent', () => {
  let component: PurchaseDeliveryListComponent;
  let fixture: ComponentFixture<PurchaseDeliveryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseDeliveryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseDeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
