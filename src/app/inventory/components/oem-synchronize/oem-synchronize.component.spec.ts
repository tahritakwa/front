import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OemSynchronizeComponent } from './oem-synchronize.component';

describe('OemSynchronizeComponent', () => {
  let component: OemSynchronizeComponent;
  let fixture: ComponentFixture<OemSynchronizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OemSynchronizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OemSynchronizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
