import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTimesheetDropdownComponent } from './project-timesheet-dropdown.component';

describe('ProjectTimesheetDropdownComponent', () => {
  let component: ProjectTimesheetDropdownComponent;
  let fixture: ComponentFixture<ProjectTimesheetDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTimesheetDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTimesheetDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
