import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSalaryRuleComponent} from './list-salary-rule.component';

describe('ListSalaryRuleComponent', () => {
  let component: ListSalaryRuleComponent;
  let fixture: ComponentFixture<ListSalaryRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSalaryRuleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalaryRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
