import {inject, TestBed} from '@angular/core/testing';
import { RhPayrollSettingsService } from './rh-payroll-settings.service';

describe('RhPayrollSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RhPayrollSettingsService]
    });
  });

  it('should be created', inject([RhPayrollSettingsService], (service: RhPayrollSettingsService) => {
    expect(service).toBeTruthy();
  }));
});