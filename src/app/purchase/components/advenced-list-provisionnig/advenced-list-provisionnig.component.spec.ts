import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvencedListProvisionnigComponent } from './advenced-list-provisionnig.component';

describe('AdvencedListProvisionnigComponent', () => {
  let component: AdvencedListProvisionnigComponent;
  let fixture: ComponentFixture<AdvencedListProvisionnigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvencedListProvisionnigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvencedListProvisionnigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
