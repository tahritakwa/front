import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricReportingDetailsComponent } from './historic-reporting-details.component';

describe('HistoricReportingDetailsComponent', () => {
  let component: HistoricReportingDetailsComponent;
  let fixture: ComponentFixture<HistoricReportingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricReportingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricReportingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
