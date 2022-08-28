import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingDocumentComponent } from './outstanding-document.component';

describe('OutstandingDocumentComponent', () => {
  let component: OutstandingDocumentComponent;
  let fixture: ComponentFixture<OutstandingDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
