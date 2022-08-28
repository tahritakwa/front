import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListExitReasonComponent} from './list-exit-reason.component';

describe('ListExitReasonComponent', () => {
  let component: ListExitReasonComponent;
  let fixture: ComponentFixture<ListExitReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListExitReasonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExitReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
