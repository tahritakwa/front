import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentOutstandingTypeDropdownComponent } from './document-outstanding-type-dropdown.component';

describe('DocumentOutstandingTypeDropdownComponent', () => {
  let component: DocumentOutstandingTypeDropdownComponent;
  let fixture: ComponentFixture<DocumentOutstandingTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentOutstandingTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentOutstandingTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
