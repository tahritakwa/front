import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiersExtractComponent } from './tiers-extract.component';

describe('TiersExtractComponent', () => {
  let component: TiersExtractComponent;
  let fixture: ComponentFixture<TiersExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiersExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiersExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
