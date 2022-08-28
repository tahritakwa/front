import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfAndStorageManageGridComponent } from './shelf-and-storage-manage-grid.component';

describe('ShelfAndStorageManageGridComponent', () => {
  let component: ShelfAndStorageManageGridComponent;
  let fixture: ComponentFixture<ShelfAndStorageManageGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelfAndStorageManageGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfAndStorageManageGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
