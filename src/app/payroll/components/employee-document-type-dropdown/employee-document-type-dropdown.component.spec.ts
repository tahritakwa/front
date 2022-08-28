import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeDocumentTypeDropdownComponent} from './employee-document-type-dropdown.component';

describe('EmployeeDocumentTypeDropdownComponent', () => {
  let component: EmployeeDocumentTypeDropdownComponent;
  let fixture: ComponentFixture<EmployeeDocumentTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDocumentTypeDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDocumentTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
