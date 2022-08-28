import { Resource } from '../shared/ressource.model';
import { Formation } from './formation.model';

export class FormationType extends Resource {
    Label: string;
    Description: string;
    DeletedToken: string;
    IdFormationType: number;
    Formation: Formation[];
}
