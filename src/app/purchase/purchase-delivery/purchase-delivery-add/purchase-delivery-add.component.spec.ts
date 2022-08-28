import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDeliveryAddComponent } from './purchase-delivery-add.component';

describe('PurchaseDeliveryAddComponent', () => {
  let component: PurchaseDeliveryAddComponent;
  let fixture: ComponentFixture<PurchaseDeliveryAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseDeliveryAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseDeliveryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
