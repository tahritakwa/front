import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateCraComponent } from './validate-cra.component';

describe('ValidateCraComponent', () => {
  let component: ValidateCraComponent;
  let fixture: ComponentFixture<ValidateCraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateCraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
