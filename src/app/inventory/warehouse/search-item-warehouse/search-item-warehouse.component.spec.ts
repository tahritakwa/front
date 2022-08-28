import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemWarehouseComponent } from './search-item-warehouse.component';

describe('SearchItemWarehouseComponent', () => {
  let component: SearchItemWarehouseComponent;
  let fixture: ComponentFixture<SearchItemWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchItemWarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchItemWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
