import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSettingComboComponent } from './sales-setting-combo.component';

describe('SalesSettingComboComponent', () => {
  let component: SalesSettingComboComponent;
  let fixture: ComponentFixture<SalesSettingComboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesSettingComboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesSettingComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
