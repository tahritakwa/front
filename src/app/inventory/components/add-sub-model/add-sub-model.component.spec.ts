import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubModelComponent } from './add-sub-model.component';

describe('AddSubModelComponent', () => {
  let component: AddSubModelComponent;
  let fixture: ComponentFixture<AddSubModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
