import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecruitmentNeedComponent} from './recruitment-need.component';

describe('RecruitmentNeedComponent', () => {
  let component: RecruitmentNeedComponent;
  let fixture: ComponentFixture<RecruitmentNeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecruitmentNeedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
