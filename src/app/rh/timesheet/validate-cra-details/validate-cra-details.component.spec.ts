import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidateCraDetailsComponent} from './validate-cra-details.component';

describe('ValidateCraDetailsComponent', () => {
  let component: ValidateCraDetailsComponent;
  let fixture: ComponentFixture<ValidateCraDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateCraDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCraDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
