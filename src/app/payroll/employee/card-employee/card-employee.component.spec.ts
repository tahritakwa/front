import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmployeeComponent } from './card-employee.component';

describe('CardEmployeeComponent', () => {
  let component: CardEmployeeComponent;
  let fixture: ComponentFixture<CardEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
