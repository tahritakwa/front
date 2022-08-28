import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentControlStatusComponent } from './document-control-status.component';

describe('DeliveryFormsListComponent', () => {
  let component: DocumentControlStatusComponent;
  let fixture: ComponentFixture<DocumentControlStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentControlStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentControlStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
