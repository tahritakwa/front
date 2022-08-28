import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageSalaryStructureValidityPeriodComponent} from './manage-salary-structure-validity-period.component';

describe('ManageSalaryStructureValidityPeriodComponent', () => {
  let component: ManageSalaryStructureValidityPeriodComponent;
  let fixture: ComponentFixture<ManageSalaryStructureValidityPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageSalaryStructureValidityPeriodComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSalaryStructureValidityPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
