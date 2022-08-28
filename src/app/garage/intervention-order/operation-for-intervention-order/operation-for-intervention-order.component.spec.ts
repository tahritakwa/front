import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationForInterventionOrderComponent } from './operation-for-intervention-order.component';

describe('OperationForInterventionOrderComponent', () => {
  let component: OperationForInterventionOrderComponent;
  let fixture: ComponentFixture<OperationForInterventionOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationForInterventionOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationForInterventionOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
