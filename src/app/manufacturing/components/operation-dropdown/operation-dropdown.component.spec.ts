import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationDropdownComponent } from './operation-dropdown.component';

describe('OperationDropdownComponent', () => {
  let component: OperationDropdownComponent;
  let fixture: ComponentFixture<OperationDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
