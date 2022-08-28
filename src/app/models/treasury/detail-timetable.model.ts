import { Resource } from '../shared/ressource.model';
import { Reconciliation } from './reconciliation.model';

export class DetailTimetable extends Resource {
    IdReconciliation?: number;
    IdPayment?: number;
    IdDetailTimetable?: number;
    DeletedToken: string;
    IdDetailTimetableNavigation: DetailTimetable;
    IdReconciliationNavigation: Reconciliation;
}
