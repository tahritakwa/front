import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryForOrderInterventionComponent } from './history-for-order-intervention.component';

describe('HistoryForOrderInterventionComponent', () => {
  let component: HistoryForOrderInterventionComponent;
  let fixture: ComponentFixture<HistoryForOrderInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryForOrderInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryForOrderInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
