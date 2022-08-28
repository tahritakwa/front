import { Resource } from '../shared/ressource.model';
import { ExitActionEmployee } from './exit-action-employee.model';

export class ExitAction extends Resource {
    Label: string;
    Description: string;
    ExitActionEmployee: Array<ExitActionEmployee>;
}
