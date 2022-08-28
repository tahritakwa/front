import { TestBed, inject } from '@angular/core/testing';

describe('SectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineService]
    });
  });

  it('should be created', inject([SectionService], (service: SectionService) => {
    expect(service).toBeTruthy();
  }));
});
