import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListLeaveTypeComponent} from './list-leave-type.component';

describe('ListLeaveTypeComponent', () => {
  let component: ListLeaveTypeComponent;
  let fixture: ComponentFixture<ListLeaveTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListLeaveTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLeaveTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
