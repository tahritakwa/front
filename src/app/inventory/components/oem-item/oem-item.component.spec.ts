import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OemItemComponent } from './oem-item.component';

describe('OemItemComponent', () => {
  let component: OemItemComponent;
  let fixture: ComponentFixture<OemItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OemItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OemItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
