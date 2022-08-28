import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KendoGridPdfComponent } from './kendo-grid-pdf.component';

describe('KendoGridPdfComponent', () => {
  let component: KendoGridPdfComponent;
  let fixture: ComponentFixture<KendoGridPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KendoGridPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KendoGridPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
