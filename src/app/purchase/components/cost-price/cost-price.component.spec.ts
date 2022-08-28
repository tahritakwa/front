import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostPriceComponent } from './cost-price.component';

describe('CostPriceComponent', () => {
  let component: CostPriceComponent;
  let fixture: ComponentFixture<CostPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
