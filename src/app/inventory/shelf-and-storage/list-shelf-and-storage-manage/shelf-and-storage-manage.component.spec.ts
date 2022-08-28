import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfAndStorageManageComponent } from './shelf-and-storage-manage.component';

describe('ShelfAndStorageManageComponent', () => {
  let component: ShelfAndStorageManageComponent;
  let fixture: ComponentFixture<ShelfAndStorageManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelfAndStorageManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfAndStorageManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
