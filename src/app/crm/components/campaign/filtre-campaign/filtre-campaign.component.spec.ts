import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreCampaignComponent } from './filtre-campaign.component';

describe('FiltreCampaignComponent', () => {
  let component: FiltreCampaignComponent;
  let fixture: ComponentFixture<FiltreCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltreCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltreCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
