import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TecDocComponent } from './tec-doc.component';

describe('TecDocComponent', () => {
  let component: TecDocComponent;
  let fixture: ComponentFixture<TecDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TecDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TecDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
