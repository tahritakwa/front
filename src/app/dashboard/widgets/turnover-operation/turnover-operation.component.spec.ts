import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoverOperationComponent } from './turnover-operation.component';

describe('TurnoverOperationComponent', () => {
  let component: TurnoverOperationComponent;
  let fixture: ComponentFixture<TurnoverOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoverOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoverOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
