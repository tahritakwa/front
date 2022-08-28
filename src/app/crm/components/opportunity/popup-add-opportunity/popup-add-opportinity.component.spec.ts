import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpporttunityComponent } from './popup-add-warehouse.component';

describe('AddOpporttunityComponent', () => {
  let component: AddOpporttunityComponent;
  let fixture: ComponentFixture<AddOpporttunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOpporttunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpporttunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
