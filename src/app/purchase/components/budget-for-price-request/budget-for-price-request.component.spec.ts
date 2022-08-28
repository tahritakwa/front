import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetForPriceRequestComponent } from './budget-for-price-request.component';

describe('BudgetForPriceRequestComponent', () => {
  let component: BudgetForPriceRequestComponent;
  let fixture: ComponentFixture<BudgetForPriceRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetForPriceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetForPriceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
