import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentWithholdingTaxComponent } from './document-withholding-tax.component';

describe('DocumentWithholdingTaxComponent', () => {
  let component: DocumentWithholdingTaxComponent;
  let fixture: ComponentFixture<DocumentWithholdingTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentWithholdingTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentWithholdingTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
