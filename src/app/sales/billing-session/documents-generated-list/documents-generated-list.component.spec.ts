import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsGeneratedListComponent } from './documents-generated-list.component';

describe('DocumentsGeneratedListComponent', () => {
  let component: DocumentsGeneratedListComponent;
  let fixture: ComponentFixture<DocumentsGeneratedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsGeneratedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsGeneratedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
