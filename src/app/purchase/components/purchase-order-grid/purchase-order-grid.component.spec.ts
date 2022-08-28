import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderGridComponent } from './purchase-order-grid.component';

describe('PurchaseOrderGridComponent', () => {
  let component: PurchaseOrderGridComponent;
  let fixture: ComponentFixture<PurchaseOrderGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
