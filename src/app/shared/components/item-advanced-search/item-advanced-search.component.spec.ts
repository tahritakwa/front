import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAdvancedSearchComponent } from './item-advanced-search.component';

describe('ItemAdvancedSearchComponent', () => {
  let component: ItemAdvancedSearchComponent;
  let fixture: ComponentFixture<ItemAdvancedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAdvancedSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
