import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavTemplateEmailComponent } from './side-nav-template-email.component';

describe('SideNavTemplateEmailComponent', () => {
  let component: SideNavTemplateEmailComponent;
  let fixture: ComponentFixture<SideNavTemplateEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavTemplateEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavTemplateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
