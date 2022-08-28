import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSupliersComponent } from './top-supliers.component';

describe('TopSupliersComponent', () => {
  let component: TopSupliersComponent;
  let fixture: ComponentFixture<TopSupliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopSupliersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSupliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
