import { TestBed, inject } from '@angular/core/testing';
import { BillingEmployeeService } from './billing-employee.service';


describe('BillingEmployeeService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BillingEmployeeService]
        });
    });

    it('should be created', inject([BillingEmployeeService], (service: BillingEmployeeService) => {
        expect(service).toBeTruthy();
    }));
});
