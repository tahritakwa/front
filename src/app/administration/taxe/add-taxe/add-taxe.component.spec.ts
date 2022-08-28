import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaxeComponent } from './add-taxe.component';

describe('AddTaxeComponent', () => {
  let component: AddTaxeComponent;
  let fixture: ComponentFixture<AddTaxeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaxeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaxeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
