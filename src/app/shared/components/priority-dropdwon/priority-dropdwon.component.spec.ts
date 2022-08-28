import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityDropdwonComponent } from './priority-dropdwon.component';

describe('PriorityDropdwonComponent', () => {
  let component: PriorityDropdwonComponent;
  let fixture: ComponentFixture<PriorityDropdwonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityDropdwonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityDropdwonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
