import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateStateOfIncomeComponent } from './generate-state-of-income.component';

describe('GenerateStateOfIncomeComponent', () => {
  let component: GenerateStateOfIncomeComponent;
  let fixture: ComponentFixture<GenerateStateOfIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateStateOfIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateStateOfIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
