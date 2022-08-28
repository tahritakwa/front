import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListInterviewByCandidacyComponent} from './list-interview-by-candidacy.component';

describe('ListInterviewByCandidacyComponent', () => {
  let component: ListInterviewByCandidacyComponent;
  let fixture: ComponentFixture<ListInterviewByCandidacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListInterviewByCandidacyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInterviewByCandidacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
