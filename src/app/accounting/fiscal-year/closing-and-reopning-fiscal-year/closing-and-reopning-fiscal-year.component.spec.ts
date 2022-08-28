import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingAndReopningFiscalYearComponent } from './closing-and-reopning-fiscal-year.component';

describe('ClosingAndReopningFiscalYearComponent', () => {
  let component: ClosingAndReopningFiscalYearComponent;
  let fixture: ComponentFixture<ClosingAndReopningFiscalYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosingAndReopningFiscalYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosingAndReopningFiscalYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
