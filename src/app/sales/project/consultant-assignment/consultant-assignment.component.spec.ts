import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantAssignmentComponent } from './consultant-assignment.component';

describe('ConsultantAssignmentComponent', () => {
  let component: ConsultantAssignmentComponent;
  let fixture: ComponentFixture<ConsultantAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultantAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultantAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
