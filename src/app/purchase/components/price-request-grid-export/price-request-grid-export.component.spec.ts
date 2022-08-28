import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRequestGridExportComponent } from './price-request-grid-export.component';

describe('PriceRequestGridExportComponent', () => {
  let component: PriceRequestGridExportComponent;
  let fixture: ComponentFixture<PriceRequestGridExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceRequestGridExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceRequestGridExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
