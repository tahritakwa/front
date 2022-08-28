import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailSearchComponent } from './inventory-detail-search.component';

describe('InventoryDetailSearchComponent', () => {
  let component: InventoryDetailSearchComponent;
  let fixture: ComponentFixture<InventoryDetailSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDetailSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
