import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabGanttDiagramComponent } from './fab-gantt-diagram.component';

describe('FabGanttDiagramComponent', () => {
  let component: FabGanttDiagramComponent;
  let fixture: ComponentFixture<FabGanttDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabGanttDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabGanttDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
