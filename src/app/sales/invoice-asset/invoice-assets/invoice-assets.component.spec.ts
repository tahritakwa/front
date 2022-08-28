import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAssetsComponent } from './invoice-assets.component';

describe('InvoiceAssetsComponent', () => {
  let component: InvoiceAssetsComponent;
  let fixture: ComponentFixture<InvoiceAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
