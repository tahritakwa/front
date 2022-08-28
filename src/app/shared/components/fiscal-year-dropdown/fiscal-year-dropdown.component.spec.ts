import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearDropdownComponent } from './fiscal-year-dropdown.component';

describe('FiscalYearDropdownComponent', () => {
  let component: FiscalYearDropdownComponent;
  let fixture: ComponentFixture<FiscalYearDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiscalYearDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
