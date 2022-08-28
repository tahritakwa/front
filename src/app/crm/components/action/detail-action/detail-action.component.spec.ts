import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailActionComponent } from './detail-action.component';

describe('DetailActionComponent', () => {
  let component: DetailActionComponent;
  let fixture: ComponentFixture<DetailActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
