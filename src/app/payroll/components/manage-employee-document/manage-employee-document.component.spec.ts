import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageEmployeeDocumentComponent} from './manage-employee-document.component';

describe('ManageEmployeeDocumentComponent', () => {
  let component: ManageEmployeeDocumentComponent;
  let fixture: ComponentFixture<ManageEmployeeDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEmployeeDocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEmployeeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
