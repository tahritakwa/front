import {inject, TestBed} from '@angular/core/testing';

import {JobsParametersService} from './jobs-parameters.service';

describe('JobsParametersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobsParametersService]
    });
  });

  it('should be created', inject([JobsParametersService], (service: JobsParametersService) => {
    expect(service).toBeTruthy();
  }));
});
