import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionOrderTypeDropdownComponent } from './intervervention-order-type-dropdown.component';

describe('InterventionOrderTypeDropdownComponent', () => {
  let component: InterventionOrderTypeDropdownComponent;
  let fixture: ComponentFixture<InterventionOrderTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionOrderTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionOrderTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
