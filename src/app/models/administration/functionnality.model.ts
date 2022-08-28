import { Resource } from '../shared/ressource.model';

export class Functionnality extends Resource {
    IdFunctionality: number;
    FunctionalityName: string;
    IdRequestType: number;
    IdRequestTypeNavigation: any;
    ApiRole: string;
}
