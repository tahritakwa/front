import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentByOfficeComponent } from './recruitment-by-office.component';

describe('RecruitmentByOfficeComponent', () => {
  let component: RecruitmentByOfficeComponent;
  let fixture: ComponentFixture<RecruitmentByOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentByOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentByOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
