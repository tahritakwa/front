import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepreciationAssetsComponent } from './add-depreciation-assets.component';

describe('AddDepreciationAssetsComponent', () => {
  let component: AddDepreciationAssetsComponent;
  let fixture: ComponentFixture<AddDepreciationAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDepreciationAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepreciationAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
