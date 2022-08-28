import {inject, TestBed} from '@angular/core/testing';
import {StyleConfigService} from './style-config.service';
import {describe, expect} from 'jasmine';


describe('StyleConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StyleConfigService]
    });
  });

  it('should be created', inject([StyleConfigService], (service: StyleConfigService) => {
    expect(service).toBeTruthy();
  }));
});
