import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentRequestShowComponent} from './document-request-show.component';

describe('DocumentRequestShowComponent', () => {
  let component: DocumentRequestShowComponent;
  let fixture: ComponentFixture<DocumentRequestShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentRequestShowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentRequestShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
