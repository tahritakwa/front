import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeDropdownComponent } from './document-type-dropdown.component';

describe('DocumentTypeDropdownComponent', () => {
  let component: DocumentTypeDropdownComponent;
  let fixture: ComponentFixture<DocumentTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
