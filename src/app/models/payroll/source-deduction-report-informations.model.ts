import { Resource } from '../shared/ressource.model';

export class SourceDeductionReportInformations extends Resource {
    Id: number;

    //Company
    CompanyMatriculeFisc: string;
    CompanyTaxIdentNumber: string;
    CompanyCategory: string;
    CompanyName: string;
    CompanyAdress: string;
    CompanySecondaryEstablishment: string;

    //Employee
    EmployeeMatricule: string;
    EmployeeFullName: string;
    EmployeeMaritalStatus: string;
    EmployeeAdress: string;
    EmployeeJob: string;
    EmployeeCIN: string;
    EmployeeMatriculeCNSS: string;
    EmployeePeriodWorked: string;

    //DetentionSourceDetails
    Taxableages: number;
    NaturalAdvantage: number;
    GrossTaxable: number;
    RetainedReinvested: number;
    TaxAmount: number;
    CSS: number;
    NetToPay: number;
    GenerationDate: Date;
}
