import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationValidateByDropdownComponent } from './operation-validate-by-dropdown.component';

describe('OperationValidateByDropdownComponent', () => {
  let component: OperationValidateByDropdownComponent;
  let fixture: ComponentFixture<OperationValidateByDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationValidateByDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationValidateByDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
