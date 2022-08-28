import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TecDocAdvancedListProductComponent } from './tec-doc-advanced-list-product.component';

describe('TecDocAdvancedListProductComponent', () => {
  let component: TecDocAdvancedListProductComponent;
  let fixture: ComponentFixture<TecDocAdvancedListProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TecDocAdvancedListProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TecDocAdvancedListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
