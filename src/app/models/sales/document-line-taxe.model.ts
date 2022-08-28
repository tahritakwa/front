import { Resource } from '../shared/ressource.model';
import { DocumentLine } from './document-line.model';
import { Taxe } from '../administration/taxe.model';

export class DocumentLineTaxe extends Resource {
    IdTaxe: number;
    IdDocumentLine: number;
    TaxeValue: string;
    TaxeAmount: string;
    TaxeName: string;
    IdDocumentLineNavigation: DocumentLine;
    IdTaxeNavigation: Taxe;
}
