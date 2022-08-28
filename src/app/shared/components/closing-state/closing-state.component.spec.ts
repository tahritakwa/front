import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingStateComponent } from './closing-state.component';

describe('ClosingStateComponent', () => {
  let component: ClosingStateComponent;
  let fixture: ComponentFixture<ClosingStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosingStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosingStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
