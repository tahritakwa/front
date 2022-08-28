import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEvaluationCriteriaThemeComponent} from './add-evaluation-criteria-theme.component';

describe('AddEvaluationCriteriaThemeComponent', () => {
  let component: AddEvaluationCriteriaThemeComponent;
  let fixture: ComponentFixture<AddEvaluationCriteriaThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEvaluationCriteriaThemeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEvaluationCriteriaThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
