import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseItemComponent } from './warehouse-item.component';

describe('ShelfAndStorageComponent', () => {
  let component: WarehouseItemComponent;
  let fixture: ComponentFixture<WarehouseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
