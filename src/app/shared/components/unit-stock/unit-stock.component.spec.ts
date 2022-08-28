import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitStockComponent } from './unit-stock.component';

describe('UnitStockComponent', () => {
  let component: UnitStockComponent;
  let fixture: ComponentFixture<UnitStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
