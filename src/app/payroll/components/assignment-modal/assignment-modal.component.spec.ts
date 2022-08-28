import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssignmentModalComponent} from './assignment-modal.component';

describe('AssignmentModalComponent', () => {
  let component: AssignmentModalComponent;
  let fixture: ComponentFixture<AssignmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssignmentModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
