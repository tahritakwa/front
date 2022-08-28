import { TestBed, inject } from '@angular/core/testing';

import { PaymentMethodService } from './payment-method.service';

describe('PaymentMethodService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PaymentMethodService]
        });
    });

    it('should be created', inject([PaymentMethodService], (service: PaymentMethodService) => {
        expect(service).toBeTruthy();
    }));
});
import { TestBed, inject } from '@angular/core/testing';

import { PaymentMethodService } from './payment-method.service';

describe('PaymentMethodService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PaymentMethodService]
        });
    });

    it('should be created', inject([PaymentMethodService], (service: PaymentMethodService) => {
        expect(service).toBeTruthy();
    }));
});
