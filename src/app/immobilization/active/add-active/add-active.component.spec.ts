import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActiveComponent } from './add-active.component';

describe('AddActiveComponent', () => {
  let component: AddActiveComponent;
  let fixture: ComponentFixture<AddActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
