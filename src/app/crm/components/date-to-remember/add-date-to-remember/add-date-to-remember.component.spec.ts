import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDateToRememberComponent } from './add-date-to-remember.component';

describe('AddDateToRememberComponent', () => {
  let component: AddDateToRememberComponent;
  let fixture: ComponentFixture<AddDateToRememberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDateToRememberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDateToRememberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
