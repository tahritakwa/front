import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListEvaluationComponent} from './list-evaluation.component';

describe('ListEvaluationComponent', () => {
  let component: ListEvaluationComponent;
  let fixture: ComponentFixture<ListEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListEvaluationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
