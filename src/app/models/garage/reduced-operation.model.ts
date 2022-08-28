import { Resource } from '../shared/ressource.model';

export class ReducedOperation extends Resource {
    Name: string;
    Ttcprice: number;
    Htprice: number;
    OperationTypeName: string;
    ExpectedDuration: number;
    ExpectedDurationFormat: string;
    DurationInDays: number;
    DurationInHours: number;
    DurationInMinutes: number;
    DurationInSecondes: number;
}
