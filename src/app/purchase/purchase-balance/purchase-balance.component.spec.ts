import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBalanceComponent } from './purchase-balance.component';

describe('PurchaseBalanceComponent', () => {
  let component: PurchaseBalanceComponent;
  let fixture: ComponentFixture<PurchaseBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
