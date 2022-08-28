import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequestListGridComponent } from './purchase-request-list-grid.component';

describe('PurchaseRequestListGridComponent', () => {
  let component: PurchaseRequestListGridComponent;
  let fixture: ComponentFixture<PurchaseRequestListGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRequestListGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRequestListGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
