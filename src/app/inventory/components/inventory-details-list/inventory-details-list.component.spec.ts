import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailsListComponent } from './inventory-details-list.component';

describe('InventoryDetailsListComponent', () => {
  let component: InventoryDetailsListComponent;
  let fixture: ComponentFixture<InventoryDetailsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDetailsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
