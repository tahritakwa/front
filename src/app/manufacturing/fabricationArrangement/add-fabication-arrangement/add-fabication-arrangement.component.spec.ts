import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFabicationArrangementComponent } from './add-fabication-arrangement.component';

describe('AddFabicationArrangementComponent', () => {
  let component: AddFabicationArrangementComponent;
  let fixture: ComponentFixture<AddFabicationArrangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFabicationArrangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFabicationArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
