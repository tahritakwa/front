import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRequestTypeComponent } from './document-request-type.component';

describe('DocumentRequestTypeComponent', () => {
  let component: DocumentRequestTypeComponent;
  let fixture: ComponentFixture<DocumentRequestTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentRequestTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentRequestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
