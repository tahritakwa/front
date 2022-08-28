import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterventionOrderComponent } from './add-intervention-order.component';

describe('AddInterventionOrderComponent', () => {
  let component: AddInterventionOrderComponent;
  let fixture: ComponentFixture<AddInterventionOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInterventionOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterventionOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
