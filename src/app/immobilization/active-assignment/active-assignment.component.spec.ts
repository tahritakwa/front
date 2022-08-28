import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveAssignmentComponent } from './active-assignment.component';

describe('ActiveAssignmentComponent', () => {
  let component: ActiveAssignmentComponent;
  let fixture: ComponentFixture<ActiveAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
