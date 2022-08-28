import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderProjectComponent } from './add-order-project.component';

describe('AddOrderProjectComponent', () => {
  let component: AddOrderProjectComponent;
  let fixture: ComponentFixture<AddOrderProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
