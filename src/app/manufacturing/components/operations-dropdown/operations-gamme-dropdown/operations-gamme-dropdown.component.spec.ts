import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsGammeDropdownComponent } from './operations-gamme-dropdown.component';

describe('OperationsGammeDropdownComponent', () => {
  let component: OperationsGammeDropdownComponent;
  let fixture: ComponentFixture<OperationsGammeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsGammeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsGammeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
