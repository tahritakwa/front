import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListInterviewAccordionComponent} from './list-interview-accordion.component';

describe('ListInterviewAccordionComponent', () => {
  let component: ListInterviewAccordionComponent;
  let fixture: ComponentFixture<ListInterviewAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListInterviewAccordionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInterviewAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
