import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTiersComponent } from './add-tiers.component';

describe('AddTiersComponent', () => {
  let component: AddTiersComponent;
  let fixture: ComponentFixture<AddTiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
