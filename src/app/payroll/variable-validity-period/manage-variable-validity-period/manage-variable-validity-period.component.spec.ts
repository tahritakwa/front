import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageVariableValidityPeriodComponent} from './manage-variable-validity-period.component';

describe('ManageVariableValidityPeriodComponent', () => {
  let component: ManageVariableValidityPeriodComponent;
  let fixture: ComponentFixture<ManageVariableValidityPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageVariableValidityPeriodComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVariableValidityPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
