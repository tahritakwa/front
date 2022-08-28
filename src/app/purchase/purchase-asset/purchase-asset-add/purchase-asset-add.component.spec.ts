import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAssetAddComponent } from './purchase-asset-add.component';

describe('PurchaseAssetAddComponent', () => {
  let component: PurchaseAssetAddComponent;
  let fixture: ComponentFixture<PurchaseAssetAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseAssetAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseAssetAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
