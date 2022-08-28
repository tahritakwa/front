import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListInterviewMarkComponent} from './list-interview-mark.component';

describe('ListInterviewMarkComponent', () => {
  let component: ListInterviewMarkComponent;
  let fixture: ComponentFixture<ListInterviewMarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListInterviewMarkComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInterviewMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
