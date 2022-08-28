import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowJobComponent} from './show-job.component';

describe('ShowJobComponent', () => {
  let component: ShowJobComponent;
  let fixture: ComponentFixture<ShowJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowJobComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
