import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricReportingComponent } from './historic-reporting.component';

describe('HistoricReportingComponent', () => {
  let component: HistoricReportingComponent;
  let fixture: ComponentFixture<HistoricReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
