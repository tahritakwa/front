import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddWarehouseComponent } from './popup-add-warehouse.component';

describe('PopupAddWarehouseComponent', () => {
  let component: PopupAddWarehouseComponent;
  let fixture: ComponentFixture<PopupAddWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupAddWarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupAddWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
