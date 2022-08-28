import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListInterviewTypeComponent} from './list-interview-type.component';

describe('ListInterviewTypeComponent', () => {
  let component: ListInterviewTypeComponent;
  let fixture: ComponentFixture<ListInterviewTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListInterviewTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInterviewTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
