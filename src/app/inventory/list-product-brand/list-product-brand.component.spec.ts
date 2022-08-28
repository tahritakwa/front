import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductBrandComponent } from './list-product-brand.component';

describe('ListProductBrandComponent', () => {
  let component: ListProductBrandComponent;
  let fixture: ComponentFixture<ListProductBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProductBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
