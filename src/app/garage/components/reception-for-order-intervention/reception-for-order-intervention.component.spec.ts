import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionForOrderInterventionComponent } from './reception-for-order-intervention.component';

describe('ReceptionForOrderInterventionComponent', () => {
  let component: ReceptionForOrderInterventionComponent;
  let fixture: ComponentFixture<ReceptionForOrderInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionForOrderInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionForOrderInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
