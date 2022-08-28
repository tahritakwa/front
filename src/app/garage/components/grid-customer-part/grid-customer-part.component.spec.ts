import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCustomerPartComponent } from './grid-customer-part.component';

describe('GridCustomerPartComponent', () => {
  let component: GridCustomerPartComponent;
  let fixture: ComponentFixture<GridCustomerPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCustomerPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCustomerPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
