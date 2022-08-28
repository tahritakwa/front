import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JobDropdownComponent} from './job-dropdown.component';

describe('JobDropdownComponent', () => {
  let component: JobDropdownComponent;
  let fixture: ComponentFixture<JobDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
