import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivingMenuComponent } from './archiving-menu.component';

describe('ArchivingMenuComponent', () => {
  let component: ArchivingMenuComponent;
  let fixture: ComponentFixture<ArchivingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
