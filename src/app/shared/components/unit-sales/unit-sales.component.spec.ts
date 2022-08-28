import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSalesComponent } from './unit-sales.component';

describe('UnitSalesComponent', () => {
  let component: UnitSalesComponent;
  let fixture: ComponentFixture<UnitSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
