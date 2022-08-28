import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShelfAndStorageComponent } from './add-shelf-and-storage.component';

describe('AddShelfAndStorageComponent', () => {
  let component: AddShelfAndStorageComponent;
  let fixture: ComponentFixture<AddShelfAndStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShelfAndStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShelfAndStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
