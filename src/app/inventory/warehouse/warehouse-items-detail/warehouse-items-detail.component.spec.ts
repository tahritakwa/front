import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseItemsDetailComponent } from './warehouse-items-detail.component';

describe('WarehouseItemsDetailComponent', () => {
  let component: WarehouseItemsDetailComponent;
  let fixture: ComponentFixture<WarehouseItemsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseItemsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseItemsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
