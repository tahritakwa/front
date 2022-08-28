import { Document } from './document.model';
import { Resource } from '../shared/ressource.model';

export class DocumentStatus extends Resource {
    Code: string;
    Label: string;
    Color: string;
    Document: Array<Document>;
}
