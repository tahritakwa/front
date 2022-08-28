import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEmployeeDocumentComponent} from './add-employee-document.component';

describe('AddEmployeeDocumentComponent', () => {
  let component: AddEmployeeDocumentComponent;
  let fixture: ComponentFixture<AddEmployeeDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeeDocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
