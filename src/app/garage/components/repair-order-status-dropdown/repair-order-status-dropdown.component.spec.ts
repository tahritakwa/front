import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairOrderStatusDropdownComponent } from './repair-order-status-dropdown.component';

describe('RepairOrderStatusDropdownComponent', () => {
  let component: RepairOrderStatusDropdownComponent;
  let fixture: ComponentFixture<RepairOrderStatusDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairOrderStatusDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairOrderStatusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
