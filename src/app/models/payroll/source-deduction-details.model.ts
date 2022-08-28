import { Resource } from '../shared/ressource.model';
import { SourceDeduction } from './source-deduction.model';

export class SourceDeductionDetails extends Resource {
    Taxableages: number;
    NaturalAdvantage: number;
    GrossTaxable: number;
    RetainedReinvested: number;
    TaxAmount: number;
    Css: number;
    NetToPay: number;
    IdSourceDeduction: number;
    IdSourceDeductionNavigation: SourceDeduction;

}
