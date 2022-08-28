import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFabricationArrangementComponent } from './list-fabrication-arrangement.component';

describe('ListFabricationArrangementComponent', () => {
  let component: ListFabricationArrangementComponent;
  let fixture: ComponentFixture<ListFabricationArrangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFabricationArrangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFabricationArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
