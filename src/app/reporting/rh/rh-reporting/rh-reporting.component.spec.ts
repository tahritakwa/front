import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhReportingComponent } from './rh-reporting.component';

describe('RhReportingComponent', () => {
  let component: RhReportingComponent;
  let fixture: ComponentFixture<RhReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
