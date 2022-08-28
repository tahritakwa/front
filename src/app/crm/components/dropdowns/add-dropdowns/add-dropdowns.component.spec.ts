import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDropdownsComponent } from './add-dropdowns.component';

describe('AddDropdownsComponent', () => {
  let component: AddDropdownsComponent;
  let fixture: ComponentFixture<AddDropdownsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDropdownsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
