import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';
import { Currency } from '../administration/currency.model';
import { ExpenseReport } from './expense-report.model';
import { ExpenseReportDetailsType } from './expense-report-details-type.model';

export class ExpenseReportDetails extends Resource {
    Description: string;
    Date: Date;
    Amount: number;
    IdCurrency: number;
    FilesInfos: Array<FileInfo>;
    IdExpenseReport: number;
    IdExpenseReportDetailsType: number;
    AttachmentUrl: string;
    IdCurrencyNavigation: Currency;
    IdExpenseReportNavigation: ExpenseReport;
    IdExpenseReportDetailsTypeNavigation: ExpenseReportDetailsType;
}
