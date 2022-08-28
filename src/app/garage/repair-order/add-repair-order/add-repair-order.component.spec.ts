import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRepairOrderComponent } from './add-repair-order.component';

describe('AddRepairOrderComponent', () => {
  let component: AddRepairOrderComponent;
  let fixture: ComponentFixture<AddRepairOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRepairOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRepairOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
