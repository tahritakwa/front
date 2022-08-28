import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitItemComponent } from './kit-item.component';

describe('KitItemComponent', () => {
  let component: KitItemComponent;
  let fixture: ComponentFixture<KitItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
