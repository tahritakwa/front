import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFiscalYearHeaderComponent } from './current-fiscal-year-header.component';

describe('CurrentFiscalYearHeaderComponent', () => {
  let component: CurrentFiscalYearHeaderComponent;
  let fixture: ComponentFixture<CurrentFiscalYearHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentFiscalYearHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentFiscalYearHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
