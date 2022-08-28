import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPurchasesVolumeComponent } from './sales-purchases-volume.component';

describe('SalesPurchasesVolumeComponent', () => {
  let component: SalesPurchasesVolumeComponent;
  let fixture: ComponentFixture<SalesPurchasesVolumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPurchasesVolumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPurchasesVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
