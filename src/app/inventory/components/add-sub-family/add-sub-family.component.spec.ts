import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubFamilyComponent } from './add-sub-family.component';

describe('AddSubFamilyComponent', () => {
  let component: AddSubFamilyComponent;
  let fixture: ComponentFixture<AddSubFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubFamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
