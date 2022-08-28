import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInterventionOrderComponent } from './list-intervention-order.component';

describe('ListInterventionOrderComponent', () => {
  let component: ListInterventionOrderComponent;
  let fixture: ComponentFixture<ListInterventionOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInterventionOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInterventionOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
