import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OprationKitMultiselectComponent } from './opration-kit-multiselect.component';

describe('OprationKitMultiselectComponent', () => {
  let component: OprationKitMultiselectComponent;
  let fixture: ComponentFixture<OprationKitMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OprationKitMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OprationKitMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
