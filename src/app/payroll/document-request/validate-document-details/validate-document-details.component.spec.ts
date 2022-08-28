import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidateDocumentDetailsComponent} from './validate-document-details.component';

describe('ValidateDocumentDetailsComponent', () => {
  let component: ValidateDocumentDetailsComponent;
  let fixture: ComponentFixture<ValidateDocumentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateDocumentDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateDocumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
