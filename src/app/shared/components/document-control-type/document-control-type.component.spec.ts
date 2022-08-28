import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentControlTypeComponent } from './document-control-type.component';

describe('DocumentControlTypeComponent', () => {
  let component: DocumentControlTypeComponent;
  let fixture: ComponentFixture<DocumentControlTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentControlTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentControlTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
