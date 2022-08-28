import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemSearchToDocumentComponent } from './add-item-search-to-document.component';

describe('AddItemSearchToDocumentComponent', () => {
  let component: AddItemSearchToDocumentComponent;
  let fixture: ComponentFixture<AddItemSearchToDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemSearchToDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemSearchToDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
