import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupTaxeComponent } from './add-group-taxe.component';

describe('AddGroupTaxeComponent', () => {
  let component: AddGroupTaxeComponent;
  let fixture: ComponentFixture<AddGroupTaxeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGroupTaxeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupTaxeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
