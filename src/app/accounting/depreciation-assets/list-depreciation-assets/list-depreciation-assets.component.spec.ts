import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDepreciationAssetsComponent } from './list-depreciation-assets.component';

describe('ListDepreciationAssetsComponent', () => {
  let component: ListDepreciationAssetsComponent;
  let fixture: ComponentFixture<ListDepreciationAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDepreciationAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDepreciationAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
