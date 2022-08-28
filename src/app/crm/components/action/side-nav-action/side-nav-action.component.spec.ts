import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavActionComponent } from './side-nav-action.component';

describe('SideNavActionComponent', () => {
  let component: SideNavActionComponent;
  let fixture: ComponentFixture<SideNavActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
