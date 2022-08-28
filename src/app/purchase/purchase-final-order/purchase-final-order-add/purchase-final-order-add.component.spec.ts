import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFinalOrderAddComponent } from './purchase-final-order-add.component';

describe('PurchaseFinalOrderAddComponent', () => {
  let component: PurchaseFinalOrderAddComponent;
  let fixture: ComponentFixture<PurchaseFinalOrderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseFinalOrderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseFinalOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
