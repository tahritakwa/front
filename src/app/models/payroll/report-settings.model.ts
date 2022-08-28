
import { Resource } from '../shared/ressource.model';

export class ReportSettings extends Resource {
    IdCompany: number;
    IdContract: number;
    Version: number;
    ReportNameToDisplay: string;
    ReportConnectionString: string;
    ReportPath: string;
    ReportName: string;
    DataLogoCompany: string;
    Url: string;
}
