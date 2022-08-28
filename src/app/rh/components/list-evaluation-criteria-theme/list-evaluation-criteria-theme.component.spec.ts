import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListEvaluationCriteriaThemeComponent} from './list-evaluation-criteria-theme.component';

describe('ListEvaluationCriteriaThemeComponent', () => {
  let component: ListEvaluationCriteriaThemeComponent;
  let fixture: ComponentFixture<ListEvaluationCriteriaThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListEvaluationCriteriaThemeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEvaluationCriteriaThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
