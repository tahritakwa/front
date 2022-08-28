import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTecDocComponent } from './list-tec-doc.component';

describe('ListTecDocComponent', () => {
  let component: ListTecDocComponent;
  let fixture: ComponentFixture<ListTecDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTecDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTecDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
