import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroupTaxeComponent } from './list-group-taxe.component';

describe('ListGroupTaxeComponent', () => {
  let component: ListGroupTaxeComponent;
  let fixture: ComponentFixture<ListGroupTaxeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGroupTaxeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGroupTaxeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
