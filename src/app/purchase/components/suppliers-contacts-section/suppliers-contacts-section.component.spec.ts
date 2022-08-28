import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersContactsSectionComponent } from './suppliers-contacts-section.component';

describe('SuppliersContactsSectionComponent', () => {
  let component: SuppliersContactsSectionComponent;
  let fixture: ComponentFixture<SuppliersContactsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliersContactsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersContactsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
