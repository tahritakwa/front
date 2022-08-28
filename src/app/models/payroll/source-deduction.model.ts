import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { SourceDeductionSession } from './source-deduction-session.model';

export class SourceDeduction extends Resource {
    CreationDate: Date;
    Year: number;
    Status: number;
    TaxableWages: number;
    NaturalAdvantage: number;
    GrossTaxable: number;
    RetainedReinvested: number;
    SumIrpp: number;
    Css: number;
    NetToPay: number;
    IdEmployee: number;
    IdSourceDeductionSession: number;
    IdEmployeeNavigation: Employee;
    IdSourceDeductionSessionNavigation: SourceDeductionSession;
}
