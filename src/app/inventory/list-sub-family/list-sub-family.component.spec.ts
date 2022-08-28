import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubFamilyComponent } from './list-sub-family.component';

describe('ListSubFamilyComponent', () => {
  let component: ListSubFamilyComponent;
  let fixture: ComponentFixture<ListSubFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubFamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
