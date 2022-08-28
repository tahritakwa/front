import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationKitDropdownComponent } from './operation-kit-dropdown.component';

describe('OperationKitDropdownComponent', () => {
  let component: OperationKitDropdownComponent;
  let fixture: ComponentFixture<OperationKitDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationKitDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationKitDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
