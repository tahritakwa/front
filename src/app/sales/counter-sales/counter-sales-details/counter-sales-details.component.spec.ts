import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterSalesDetailsComponent } from './counter-sales-details.component';

describe('CounterSalesDetailsComponent', () => {
  let component: CounterSalesDetailsComponent;
  let fixture: ComponentFixture<CounterSalesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterSalesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterSalesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
