import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTemplateEmailComponent } from './detail-template-email.component';

describe('DetailTemplateEmailComponent', () => {
  let component: DetailTemplateEmailComponent;
  let fixture: ComponentFixture<DetailTemplateEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTemplateEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTemplateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
