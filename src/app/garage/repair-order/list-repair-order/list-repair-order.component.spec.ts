import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRepairOrderComponent } from './list-repair-order.component';

describe('ListRepairOrderComponent', () => {
  let component: ListRepairOrderComponent;
  let fixture: ComponentFixture<ListRepairOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRepairOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRepairOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
