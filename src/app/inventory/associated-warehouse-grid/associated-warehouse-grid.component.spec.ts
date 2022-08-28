import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedWarehouseGridComponent } from './associated-warehouse-grid.component';

describe('AssociatedWarehouseGridComponent', () => {
  let component: AssociatedWarehouseGridComponent;
  let fixture: ComponentFixture<AssociatedWarehouseGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociatedWarehouseGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedWarehouseGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
