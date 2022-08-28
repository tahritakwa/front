import { Resource } from '../shared/ressource.model';
import { PayslipReportLines } from './payslip-report-lines.model';

export class PayslipReportInformations extends Resource {
    // Company informations
    CompanyName: string;
    CompanyAdress: string;
    CompanyMatriculeFisc: string;
    CompanyCnssAffiliation: string;
    // Employee Informations
    EmployeeFullName: string;
    EmployeeRegistrationNumber: string;
    EmployeeCnss: string;
    EmployeeAdress: string;
    EmployeeContractType: string;
    EmployeeHiringDate: string;
    EmployeeIdentityPiece: string;
    EmployeeGrade: string;
    EmployeeBaseSalary: string;
    EmployeeFamilyLeader: boolean;
    EmployeeEchellon: string;
    EmployeePaidLeave: number;
    EmployeeUnPaidLeave: number;
    EmployeeChildreenNumber: number;
    EmployeeCategory: string;
    // Payslip informations
    NumberOfDaysWorked: number;
    Month: Date;
    SalaryOfMonth: number;
    NetToPay: number;
    CompanyCurrency: string;
    // To identify the contract for which we are doing the preview
    IdContract: number;
    // Maximum number of days allowed for the current pay month
    NumberOfDaysWorkedByCompanyInMonth: number;
    // Payslip salary rule lines
    PayslipReportLinesViewModels: Array<PayslipReportLines>;
}
