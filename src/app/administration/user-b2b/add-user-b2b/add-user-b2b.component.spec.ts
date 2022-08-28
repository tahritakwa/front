import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserB2bComponent } from './add-user-b2b.component';

describe('AddUserB2bComponent', () => {
  let component: AddUserB2bComponent;
  let fixture: ComponentFixture<AddUserB2bComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserB2bComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
