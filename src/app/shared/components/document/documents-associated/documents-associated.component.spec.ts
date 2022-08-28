import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAssociatedComponent } from './documents-associated.component';

describe('DocumentsAssociatedComponent', () => {
  let component: DocumentsAssociatedComponent;
  let fixture: ComponentFixture<DocumentsAssociatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsAssociatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAssociatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
