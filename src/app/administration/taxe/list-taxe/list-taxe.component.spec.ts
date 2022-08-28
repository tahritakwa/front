import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTaxeComponent } from './list-taxe.component';

describe('ListTaxeComponent', () => {
  let component: ListTaxeComponent;
  let fixture: ComponentFixture<ListTaxeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTaxeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTaxeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
