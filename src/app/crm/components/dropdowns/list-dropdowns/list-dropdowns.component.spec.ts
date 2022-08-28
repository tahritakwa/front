import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDropdownsComponent } from './list-dropdowns.component';

describe('ListDropdownsComponent', () => {
  let component: ListDropdownsComponent;
  let fixture: ComponentFixture<ListDropdownsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDropdownsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
