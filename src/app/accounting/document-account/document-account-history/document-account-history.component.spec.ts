import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAccountHistoryComponent } from './document-account-history.component';

describe('DocumentAacountHistoryComponent', () => {
  let component: DocumentAccountHistoryComponent;
  let fixture: ComponentFixture<DocumentAccountHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentAccountHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentAccountHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
