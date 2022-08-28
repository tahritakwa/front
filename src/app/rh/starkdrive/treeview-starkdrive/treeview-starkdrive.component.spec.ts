import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TreeviewStarkdriveComponent} from './treeview-starkdrive.component';

describe('TreeviewStarkdriveComponent', () => {
  let component: TreeviewStarkdriveComponent;
  let fixture: ComponentFixture<TreeviewStarkdriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeviewStarkdriveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeviewStarkdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
