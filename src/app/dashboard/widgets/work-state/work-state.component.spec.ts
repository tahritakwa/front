import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStateComponent } from './work-state.component';

describe('WorkStateComponent', () => {
  let component: WorkStateComponent;
  let fixture: ComponentFixture<WorkStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
