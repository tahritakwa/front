import { Dashboard } from './dashboard.model';

export class DeliveryRate extends Dashboard {
    TotalCommanded: number;
    TotalDelivred: number;
    DeliveryRate: number;
    DocumentMonth: number;
    DocumentYear: number;
}
