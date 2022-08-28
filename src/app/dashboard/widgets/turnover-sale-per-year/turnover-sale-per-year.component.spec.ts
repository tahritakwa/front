import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoverSalePerYearComponent } from './turnover-sale-per-year.component';

describe('TurnoverSalePerYearComponent', () => {
  let component: TurnoverSalePerYearComponent;
  let fixture: ComponentFixture<TurnoverSalePerYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoverSalePerYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoverSalePerYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
