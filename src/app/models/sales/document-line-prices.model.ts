import { Resource } from '../shared/ressource.model';
import { DocumentLine } from './document-line.model';
import { Prices } from './prices.model';

export class DocumentLinePrices extends Resource {
    IdPrices?: number;
    IdDocumentLine?: number;
    DeletedToken: string;
    IdDocumentLineNavigation: DocumentLine;
    IdPricesNavigation: Prices;
}
