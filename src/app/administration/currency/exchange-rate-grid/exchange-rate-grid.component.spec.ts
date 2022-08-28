import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateGridComponent } from './exchange-rate-grid.component';

describe('ExchangeRateGridComponent', () => {
  let component: ExchangeRateGridComponent;
  let fixture: ComponentFixture<ExchangeRateGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeRateGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
