import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOrderDocumentLinesComponent } from './import-order-document-lines.component';

describe('ImportOrderDocumentLinesComponent', () => {
  let component: ImportOrderDocumentLinesComponent;
  let fixture: ComponentFixture<ImportOrderDocumentLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportOrderDocumentLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportOrderDocumentLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
