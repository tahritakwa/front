import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchSectionDocumentComponent} from './search-section-document.component';

describe('SearchSectionDocumentComponent', () => {
  let component: SearchSectionDocumentComponent;
  let fixture: ComponentFixture<SearchSectionDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchSectionDocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSectionDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
