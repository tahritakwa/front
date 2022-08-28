import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationStatusDropdownComponent } from './operation-status-dropdown.component';

describe('OperationStatusDropdownComponent', () => {
  let component: OperationStatusDropdownComponent;
  let fixture: ComponentFixture<OperationStatusDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationStatusDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationStatusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
