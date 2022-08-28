
import { Resource } from '../shared/ressource.model';
export class DailySalesDeliveryReportQueryViewModel extends Resource {
    DeletedToken: string;
    StartDate: Date;
    EndDate: Date;
    CodeStatus: number;
    IdStatus: number;
    IdType: string;
    GroupByTiers: number;
    ListTiers: any; 
}
