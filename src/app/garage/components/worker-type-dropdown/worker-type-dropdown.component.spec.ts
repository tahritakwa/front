import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerTypeDropdownComponent } from './worker-type-dropdown.component';

describe('WorkerTypeDropdownComponent', () => {
  let component: WorkerTypeDropdownComponent;
  let fixture: ComponentFixture<WorkerTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
