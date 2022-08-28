import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFiscalYearDropdownComponent } from './current-fiscal-year-dropdown.component';

describe('CurrentFiscalYearDropdownComponent', () => {
  let component: CurrentFiscalYearDropdownComponent;
  let fixture: ComponentFixture<CurrentFiscalYearDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentFiscalYearDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentFiscalYearDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
