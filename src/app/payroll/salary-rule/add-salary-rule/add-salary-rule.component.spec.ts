import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddSalaryRuleComponent} from './add-salary-rule.component';

describe('AddSalaryRuleComponent', () => {
  let component: AddSalaryRuleComponent;
  let fixture: ComponentFixture<AddSalaryRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalaryRuleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalaryRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
