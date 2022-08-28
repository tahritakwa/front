import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OrganizationChartEmployeeComponent} from './organization-chart-employee.component';

describe('OrganizationChartEmployeeComponent', () => {
  let component: OrganizationChartEmployeeComponent;
  let fixture: ComponentFixture<OrganizationChartEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationChartEmployeeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationChartEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
