import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemEcommerceComponent } from './search-item-ecommerce.component';

describe('SearchItemEcommerceComponent', () => {
  let component: SearchItemEcommerceComponent;
  let fixture: ComponentFixture<SearchItemEcommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchItemEcommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchItemEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
