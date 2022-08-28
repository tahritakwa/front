import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddCvDocumentComponent} from './add-cv-document.component';

describe('AddCvDocumentComponent', () => {
  let component: AddCvDocumentComponent;
  let fixture: ComponentFixture<AddCvDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCvDocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCvDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
