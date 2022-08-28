import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearHistoricComponent } from './fiscal-year-historic.component';

describe('FiscalYearHistoricComponent', () => {
  let component: FiscalYearHistoricComponent;
  let fixture: ComponentFixture<FiscalYearHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiscalYearHistoricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
