import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionTypeDropdownComponent } from './commission-type-dropdown.component';

describe('CommissionTypeDropdownComponent', () => {
  let component: CommissionTypeDropdownComponent;
  let fixture: ComponentFixture<CommissionTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
