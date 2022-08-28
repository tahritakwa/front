import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAssetListComponent } from './purchase-asset-list.component';

describe('PurchaseAssetListComponent', () => {
  let component: PurchaseAssetListComponent;
  let fixture: ComponentFixture<PurchaseAssetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseAssetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
