import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListBonusComponent} from './list-bonus.component';

describe('ListBonusComponent', () => {
  let component: ListBonusComponent;
  let fixture: ComponentFixture<ListBonusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListBonusComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
