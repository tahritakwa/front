import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityKanbanComponent } from './opportunity-kanban.component';

describe('OpportunityKanbanComponent', () => {
  let component: OpportunityKanbanComponent;
  let fixture: ComponentFixture<OpportunityKanbanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityKanbanComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
